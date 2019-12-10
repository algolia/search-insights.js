import { getCookie } from "../_cookieUtils";
import AlgoliaAnalytics from "../insights";
import { createUUID } from "../utils/uuid";
import * as utils from "../utils";

jest.mock("../utils/uuid", () => ({
  createUUID: jest.fn()
}));

const credentials = {
  apiKey: "test",
  appId: "test",
  cookieDuration: 10 * 24 * 3600 * 1000 // 10 days
};

const DAY = 86400000; /* 1 day in ms*/
const DATE_TOMORROW = new Date(Date.now() + DAY).toUTCString();
const DATE_YESTERDAY = new Date(Date.now() - DAY).toUTCString();

describe("cookieUtils", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({
      requestFn: () => {}
    });
    analyticsInstance.init(credentials);
    createUUID.mockReset();
    createUUID
      .mockReturnValueOnce("mock-uuid-1")
      .mockReturnValueOnce("mock-uuid-2")
      .mockReturnValue("mock-uuid-2+");
    // clear cookies
    document.cookie = "_ALGOLIA=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
    document.cookie = "alg_user_token=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
  });
  describe("setUserToken", () => {
    describe("ANONYMOUS_USER_TOKEN", () => {
      it("should create a cookie with a UUID", () => {
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should reuse previously created UUID", () => {
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should not reuse UUID from an expired cookie", () => {
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        // set cookie as expired
        document.cookie = "_ALGOLIA=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-2");
      });
      it("should throw if environment does not support cookies", () => {
        const mockSupportsCookies = jest
          .spyOn(utils, "supportsCookies")
          .mockReturnValue(false);
        expect(() =>
          analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN)
        ).toThrowErrorMatchingInlineSnapshot(
          `"Tracking of anonymous users is only possible on environments which support cookies."`
        );
        mockSupportsCookies.mockRestore();
      });
    });
    describe("provided userToken", () => {
      it("should create a cookie with provided userToken", () => {
        analyticsInstance.setUserToken("007");
        expect(document.cookie).toBe("alg_user_token=007");
      });
      it("create a anonymous cookie when switching from provided userToken to anonymous", () => {
        analyticsInstance.setUserToken("007");
        expect(document.cookie).toBe("alg_user_token=007");
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe(
          "alg_user_token=007; _ALGOLIA=anonymous-mock-uuid-1"
        );
      });
      it("should preserve the cookie with same uuid when userToken provided after anonymous", () => {
        expect(document.cookie).toBe("");
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        analyticsInstance.setUserToken("007");
        expect(document.cookie).toBe(
          "_ALGOLIA=anonymous-mock-uuid-1; alg_user_token=007"
        );
      });
      it("should override USER_TOKEN cookie if setUserToken called with a different value", () => {
        expect(document.cookie).toBe("");
        analyticsInstance.setUserToken("007");
        expect(document.cookie).toBe("alg_user_token=007");
        analyticsInstance.setUserToken("008");
        expect(document.cookie).toBe("alg_user_token=008");
      });
    });
  });
  describe("reuseUserTokenStoredInCookies", () => {
    it("should throw if environment does not support cookies", () => {
      const supportsCookies = jest
        .spyOn(utils, "supportsCookies")
        .mockReturnValue(false);
      expect(() =>
        analyticsInstance.reuseUserTokenStoredInCookies()
      ).toThrowErrorMatchingInlineSnapshot(
        `"This environment does not support cookies."`
      );
      supportsCookies.mockRestore();
    });
    it("should throw if supports cookies but no cookies found", () => {
      const supportsCookies = jest
        .spyOn(utils, "supportsCookies")
        .mockReturnValue(true);
      expect(() =>
        analyticsInstance.reuseUserTokenStoredInCookies()
      ).toThrowErrorMatchingInlineSnapshot(`"No cookies found."`);
      supportsCookies.mockRestore();
    });
    it("should not throw if has ANONYMOUS cookie is found", () => {
      const supportsCookies = jest
        .spyOn(utils, "supportsCookies")
        .mockReturnValue(true);

      document.cookie = `_ALGOLIA=value;expires=${DATE_TOMORROW};path=/`;

      expect(() =>
        analyticsInstance.reuseUserTokenStoredInCookies()
      ).not.toThrow();

      supportsCookies.mockRestore();
    });
    it("should reuse USER_TOKEN cookie first if present", () => {
      const supportsCookies = jest
        .spyOn(utils, "supportsCookies")
        .mockReturnValue(true);

      document.cookie = `_ALGOLIA=anonymous-value;expires=${DATE_TOMORROW};path=/`;
      document.cookie = `alg_user_token=user-value;expires=${DATE_TOMORROW};path=/`;

      analyticsInstance.reuseUserTokenStoredInCookies();
      expect(analyticsInstance._userToken).toEqual("user-value");

      supportsCookies.mockRestore();
    });
    it("should reuse ANONYMOUS_TOKEN cookie if present USER_TOKEN not present", () => {
      const supportsCookies = jest
        .spyOn(utils, "supportsCookies")
        .mockReturnValue(true);

      document.cookie = `_ALGOLIA=anonymous-value;expires=${DATE_TOMORROW};path=/`;

      analyticsInstance.reuseUserTokenStoredInCookies();
      expect(analyticsInstance._userToken).toEqual("anonymous-value");

      supportsCookies.mockRestore();
    });
    it("should reuse ANONYMOUS_TOKEN cookie if present USER_TOKEN expired", () => {
      const supportsCookies = jest
        .spyOn(utils, "supportsCookies")
        .mockReturnValue(true);

      document.cookie = `_ALGOLIA=anonymous-value;expires=${DATE_TOMORROW};path=/`;
      document.cookie = `alg_user_token=user-value;expires=${DATE_YESTERDAY};path=/`;

      analyticsInstance.reuseUserTokenStoredInCookies();
      expect(analyticsInstance._userToken).toEqual("anonymous-value");

      supportsCookies.mockRestore();
    });
  });
  describe("getUserToken", () => {
    beforeEach(() => {
      analyticsInstance.setUserToken("007");
    });
    it("should return the current userToken", () => {
      const userToken = analyticsInstance.getUserToken();
      expect(userToken).toEqual("007");
    });
    it("should accept a callback", () => {
      analyticsInstance.getUserToken({}, (err, userToken) => {
        expect(err).toEqual(null);
        expect(userToken).toEqual("007");
      });
    });

    // TODO: move this suite outside getUserToken tests
    describe("getCookie", () => {
      it("should return '' _ALGOLIA cookie when not available", () => {
        document.cookie = `_ALGOLIA=value;expires=${DATE_YESTERDAY};path=/`;
        expect(getCookie("_ALGOLIA")).toEqual("");
      });
      it("should get _ALGOLIA cookie when available", () => {
        document.cookie = `_ALGOLIA=value;expires=${DATE_TOMORROW};path=/`;

        expect(getCookie("_ALGOLIA")).toEqual("value");
      });
      it("should not care about other cookie if malformed", () => {
        document.cookie = `_ALGOLIA=value;expires=${DATE_TOMORROW};path=/`;
        document.cookie = `BAD_COOKIE=val%ue;expires=${DATE_TOMORROW};path=/`;

        expect(getCookie("_ALGOLIA")).toEqual("value");
      });
    });
  });
});

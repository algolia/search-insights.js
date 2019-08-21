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

describe("cookieUtils", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
    analyticsInstance.init(credentials);
    createUUID.mockReset();
    createUUID
      .mockReturnValueOnce("mock-uuid-1")
      .mockReturnValueOnce("mock-uuid-2")
      .mockReturnValue("mock-uuid-2+");
    // clear cookies
    document.cookie = "_ALGOLIA=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
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
          `"Tracking of anonymous users is possible on environment that support cookies."`
        );
        mockSupportsCookies.mockRestore();
      });
    });
    describe("provided userToken", () => {
      it("should not create a cookie with provided userToken", () => {
        analyticsInstance.setUserToken("007");
        expect(document.cookie).toBe("");
      });
      it("create a anonymous cookie when switching from provided userToken to anonymous", () => {
        analyticsInstance.setUserToken("007");
        expect(document.cookie).toBe("");
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should preserve the cookie with same uuid when userToken provided after anonymous", () => {
        analyticsInstance.setUserToken(analyticsInstance.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        analyticsInstance.setUserToken("007");
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
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
  });
});

import { getInstance } from "../_instance";
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
  let AlgoliaInsights;
  beforeEach(() => {
    AlgoliaInsights = getInstance();
    AlgoliaInsights.init(credentials);
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
        AlgoliaInsights.setUserToken(AlgoliaInsights.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should reuse previously created UUID", () => {
        AlgoliaInsights.setUserToken(AlgoliaInsights.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        AlgoliaInsights.setUserToken(AlgoliaInsights.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should not reuse UUID from an expired cookie", () => {
        AlgoliaInsights.setUserToken(AlgoliaInsights.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        // set cookie as expired
        document.cookie = "_ALGOLIA=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        AlgoliaInsights.setUserToken(AlgoliaInsights.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-2");
      });
      it("should throw if environment does not support cookies", () => {
        const mockSupportsCookies = jest
          .spyOn(utils, "supportsCookies")
          .mockReturnValue(false);
        expect(() =>
          AlgoliaInsights.setUserToken(AlgoliaInsights.ANONYMOUS_USER_TOKEN)
        ).toThrowErrorMatchingInlineSnapshot(
          `"Tracking of anonymous users is possible on environment that support cookies."`
        );
        mockSupportsCookies.mockRestore();
      });
    });
    describe("provided userToken", () => {
      it("should not create a cookie with provided userToken", () => {
        AlgoliaInsights.setUserToken("007");
        expect(document.cookie).toBe("");
      });
      it("create a anonymous cookie when switching from provided userToken to anonymous", () => {
        AlgoliaInsights.setUserToken("007");
        expect(document.cookie).toBe("");
        AlgoliaInsights.setUserToken(AlgoliaInsights.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should preserve the cookie with same uuid when userToken provided after anonymous", () => {
        AlgoliaInsights.setUserToken(AlgoliaInsights.ANONYMOUS_USER_TOKEN);
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        AlgoliaInsights.setUserToken("007");
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
    });
  });
  describe("getUserToken", () => {
    beforeEach(() => {
      AlgoliaInsights.setUserToken("007");
    });
    it("should return the current userToken", () => {
      const userToken = AlgoliaInsights.getUserToken();
      expect(userToken).toEqual("007");
    });
    it("should accept a callback", () => {
      AlgoliaInsights.getUserToken({}, (err, userToken) => {
        expect(err).toEqual(null);
        expect(userToken).toEqual("007");
      });
    });
  });
});

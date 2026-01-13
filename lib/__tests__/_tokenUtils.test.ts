import { getCookie } from "../_tokenUtils";
import AlgoliaAnalytics from "../insights";
import { createUUID } from "../utils/uuid";

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

describe("tokenUtils", () => {
  let analyticsInstance: AlgoliaAnalytics;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({
      requestFn: jest.fn().mockResolvedValue(true)
    });
    analyticsInstance.init(credentials);
    (createUUID as jest.MockedFunction<typeof createUUID>).mockReset();
    (createUUID as jest.MockedFunction<typeof createUUID>)
      .mockReturnValueOnce("mock-uuid-1")
      .mockReturnValueOnce("mock-uuid-2")
      .mockReturnValue("mock-uuid-2+");
    // clear cookies
    document.cookie = "_ALGOLIA=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
  });

  describe("setUserToken", () => {
    describe("anonymous userToken", () => {
      it("should create a cookie with a UUID", () => {
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should reuse previously created UUID", () => {
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should not reuse UUID from an expired cookie", () => {
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        // set cookie as expired
        document.cookie = "_ALGOLIA=;expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-2");
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
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
      it("should preserve the cookie with same uuid when userToken provided after anonymous", () => {
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
        analyticsInstance.setUserToken("007");
        expect(document.cookie).toBe("_ALGOLIA=anonymous-mock-uuid-1");
      });
    });
  });

  describe("setAuthenticatedUserToken", () => {
    it("should set authenticatedUserToken", () => {
      expect(analyticsInstance._authenticatedUserToken).toBeUndefined();

      analyticsInstance.setAuthenticatedUserToken("008");
      expect(analyticsInstance._authenticatedUserToken).toBe("008");
    });
    it("should not create a cookie with provided authenticatedUserToken", () => {
      analyticsInstance.setAuthenticatedUserToken("008");
      expect(document.cookie).toBe("");
    });
    it("should be able to unset authenticatedUserToken", () => {
      analyticsInstance.setAuthenticatedUserToken("008");
      expect(analyticsInstance._authenticatedUserToken).toBe("008");

      analyticsInstance.setAuthenticatedUserToken(undefined);
      expect(analyticsInstance._authenticatedUserToken).toBeUndefined();
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
      expect.assertions(2);
      analyticsInstance.getUserToken({}, (err, userToken) => {
        expect(err).toEqual(null);
        expect(userToken).toEqual("007");
      });
    });

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

  describe("getAuthenticatedUserToken", () => {
    it("should return undefined if not set", () => {
      const authenticatedUserToken =
        analyticsInstance.getAuthenticatedUserToken();
      expect(authenticatedUserToken).toBeUndefined();
    });
    it("should return current authenticatedUserToken", () => {
      analyticsInstance.setAuthenticatedUserToken("008");
      const authenticatedUserToken =
        analyticsInstance.getAuthenticatedUserToken();
      expect(authenticatedUserToken).toEqual("008");
    });
    it("should accept a callback", () => {
      expect.assertions(2);
      analyticsInstance.setAuthenticatedUserToken("009");
      analyticsInstance.getAuthenticatedUserToken(
        {},
        (err, authenticatedUserToken) => {
          expect(err).toEqual(null);
          expect(authenticatedUserToken).toEqual("009");
        }
      );
    });
  });

  describe("cookie security flags", () => {
    const originalLocation = window.location;
    let cookieSetter: jest.SpyInstance;

    beforeEach(() => {
      // Clear all cookies before each test
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/`;
      });

      cookieSetter = jest.spyOn(
        Object.getPrototypeOf(document),
        "cookie",
        "set"
      );
    });

    afterEach(() => {
      Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: originalLocation
      });

      cookieSetter.mockRestore();
    });

    describe("on HTTPS", () => {
      beforeEach(() => {
        // HTTPS mock
        delete (window as any).location;
        window.location = { ...originalLocation, protocol: "https:" } as any;
      });

      it("should set Secure flag when creating anonymous token on HTTPS", () => {
        analyticsInstance.setAnonymousUserToken();

        expect(cookieSetter).toHaveBeenCalled();

        const cookieString = cookieSetter.mock.calls[0][0];

        expect(cookieString).toContain("_ALGOLIA=anonymous-mock-uuid-1");
        expect(cookieString).toContain(";Secure");
        expect(cookieString).toContain("expires=");
        expect(cookieString).toContain("path=/");
      });

      it("should set all cookie attributes on HTTPS", () => {
        analyticsInstance.setAnonymousUserToken();

        const cookieString = cookieSetter.mock.calls[0][0];

        expect(cookieString).toContain(";Secure");
        expect(cookieString).toContain("_ALGOLIA=anonymous-mock-uuid-1");
        expect(cookieString).toContain("expires=");
        expect(cookieString).toContain("path=/");
      });
    });

    describe("on HTTP", () => {
      beforeEach(() => {
        // HTTP mock
        delete (window as any).location;
        window.location = { ...originalLocation, protocol: "http:" } as any;
      });

      it("should NOT set Secure flag when creating anonymous token on HTTP", () => {
        analyticsInstance.setAnonymousUserToken();

        expect(cookieSetter).toHaveBeenCalled();

        const cookieString = cookieSetter.mock.calls[0][0];

        expect(cookieString).toContain("_ALGOLIA=anonymous-mock-uuid-1");
        expect(cookieString).not.toContain(";Secure");
        expect(cookieString).not.toContain("Secure");
      });

      it("should still set basic cookie attributes on HTTP", () => {
        analyticsInstance.setAnonymousUserToken();

        const cookieString = cookieSetter.mock.calls[0][0];

        expect(cookieString).toContain("_ALGOLIA=anonymous-mock-uuid-1");
        expect(cookieString).toContain("expires=");
        expect(cookieString).toContain("path=/");

        expect(document.cookie).toContain("_ALGOLIA=anonymous-mock-uuid-1");
      });
    });

    describe("protocol detection", () => {
      it("should correctly detect HTTPS protocol", () => {
        delete (window as any).location;
        window.location = { ...originalLocation, protocol: "https:" } as any;

        analyticsInstance.setAnonymousUserToken();

        const cookieString = cookieSetter.mock.calls[0][0];
        expect(cookieString).toContain(";Secure");
      });

      it("should correctly detect HTTP protocol", () => {
        delete (window as any).location;
        window.location = { ...originalLocation, protocol: "http:" } as any;

        analyticsInstance.setAnonymousUserToken();

        const cookieString = cookieSetter.mock.calls[0][0];
        expect(cookieString).not.toContain(";Secure");
      });

      it("should handle localhost with HTTPS", () => {
        delete (window as any).location;
        window.location = {
          ...originalLocation,
          protocol: "https:",
          hostname: "localhost"
        } as any;

        analyticsInstance.setAnonymousUserToken();

        const cookieString = cookieSetter.mock.calls[0][0];
        expect(cookieString).toContain(";Secure");
      });

      it("should handle localhost with HTTP", () => {
        delete (window as any).location;
        window.location = {
          ...originalLocation,
          protocol: "http:",
          hostname: "localhost"
        } as any;

        analyticsInstance.setAnonymousUserToken();

        const cookieString = cookieSetter.mock.calls[0][0];
        expect(cookieString).not.toContain(";Secure");
      });
    });
  });
});

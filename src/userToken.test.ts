import Cookies from "js-cookie";
import { ANONMYOUS_ID_KEY, USER_TOKEN_KEY, UserToken } from "./userToken";

function clearCookies() {
  Cookies.remove(USER_TOKEN_KEY);
  Cookies.remove(ANONMYOUS_ID_KEY);
}

describe("UserToken", () => {
  describe("anonymousId and userToken cookie enabled (default)", () => {
    const userTokenDefault = new UserToken();

    test("calling getUserToken before setUserToken returns anon id", () => {
      const anonToken = userTokenDefault.getUserToken();
      expect(anonToken).toContain("anon-");
      expect(Cookies.get(ANONMYOUS_ID_KEY)).toBe(anonToken);
    });

    test("setUserToken stores token as cookie and removes anon id", () => {
      const userToken = "test-token-1";
      userTokenDefault.setUserToken(userToken);
      const got = userTokenDefault.getUserToken();

      expect(got).toBe(userToken);
      expect(Cookies.get(USER_TOKEN_KEY)).toBe(userToken);
      expect(Cookies.get(ANONMYOUS_ID_KEY)).toBeUndefined();

      clearCookies();
    });
  });

  describe("anonymousId enabled and userToken cookie disabled", () => {
    const userTokenCookieDisabled = new UserToken({
      anonmyousId: { enabled: true, lease: 60 },
      userToken: { cookie: false, lease: 1440 }
    });

    test("calling getUserToken before setUserToken returns anon id", () => {
      const anonToken = userTokenCookieDisabled.getUserToken();
      expect(anonToken).toContain("anon-");
      expect(Cookies.get(ANONMYOUS_ID_KEY)).toBe(anonToken);
    });

    test("setUserToken stores token and removes anon id", () => {
      const userToken = "test-token-2";
      userTokenCookieDisabled.setUserToken(userToken);
      const got = userTokenCookieDisabled.getUserToken();

      expect(got).toBe(userToken);
      expect(Cookies.get(ANONMYOUS_ID_KEY)).toBeUndefined();
      expect(Cookies.get(USER_TOKEN_KEY)).toBeUndefined();
    });
  });

  describe("anonymousId disabled and userToken cookie enabled", () => {
    const userTokenAnonIdDisabled = new UserToken({
      anonmyousId: { enabled: false, lease: 60 },
      userToken: { cookie: true, lease: 1440 }
    });

    test("calling getUserToken before setUserToken returns undefined anon id", () => {
      const anonToken = userTokenAnonIdDisabled.getUserToken();
      expect(anonToken).toBeUndefined();
    });

    test("setUserToken stores token as cookie", () => {
      const userToken = "test-token-3";
      userTokenAnonIdDisabled.setUserToken(userToken);
      const got = userTokenAnonIdDisabled.getUserToken();

      expect(got).toBe(userToken);
      expect(Cookies.get(USER_TOKEN_KEY)).toBe(userToken);
      expect(Cookies.get(ANONMYOUS_ID_KEY)).toBeUndefined;

      clearCookies();
    });
  });

  // TODO: test case for anonymousId and userToken cookie disabled
});

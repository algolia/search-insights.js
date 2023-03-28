import Cookies from 'js-cookie';

import { ANONYMOUS_ID_KEY, USER_TOKEN_KEY, UserToken } from './userToken';

function clearCookies() {
  Cookies.remove(USER_TOKEN_KEY);
  Cookies.remove(ANONYMOUS_ID_KEY);
}

describe('UserToken', () => {
  afterEach(() => {
    // Ensure cookies don't persist to next test
    clearCookies();
  });

  describe('anonymousId disabled and userToken cookie enabled (default)', () => {
    const userTokenDefault = new UserToken();

    test('calling getUserToken before setUserToken returns undefined', () => {
      expect(userTokenDefault.getUserToken()).toBeUndefined();
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
    });

    test('calling setUserToken without any arguments generates an anon id', () => {
      userTokenDefault.setUserToken();
      const userToken = userTokenDefault.getUserToken();
      expect(userToken).toContain('anon-');
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBe(userToken);
    });

    test("calling setUserToken without any arguments for a second time doesn't remove the existing anon id", () => {
      userTokenDefault.setUserToken();
      const userToken = userTokenDefault.getUserToken();
      userTokenDefault.setUserToken();
      const userToken2 = userTokenDefault.getUserToken();
      expect(userToken).toEqual(userToken2);
    });

    test('setUserToken stores token as cookie and removes anon id', () => {
      const userToken = 'test-token-1';
      userTokenDefault.setUserToken(userToken);

      const got = userTokenDefault.getUserToken();

      expect(got).toBe(userToken);
      expect(Cookies.get(USER_TOKEN_KEY)).toBe(userToken);
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
    });

    test('setUserToken without arguments removes the existing token', () => {
      const userToken = 'test-token-1';
      userTokenDefault.setUserToken(userToken);
      userTokenDefault.setUserToken();

      const got = userTokenDefault.getUserToken();
      expect(got).toContain('anon-');
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBe(got);
      expect(Cookies.get(USER_TOKEN_KEY)).toBeUndefined();
    });

    test("removeUserToken removes anon id and ensures a new one isn't generated on next get", () => {
      userTokenDefault.setUserToken();
      userTokenDefault.getUserToken();
      userTokenDefault.removeUserToken();
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
      expect(userTokenDefault.getUserToken()).toBeUndefined();
    });

    test('removeUserToken removes a user token', () => {
      const userToken = 'test-token-2';
      userTokenDefault.setUserToken(userToken);
      userTokenDefault.removeUserToken();
      expect(Cookies.get(USER_TOKEN_KEY)).toBeUndefined();
    });
  });

  describe('anonymousId enabled and userToken cookie disabled', () => {
    const userTokenCookieDisabled = new UserToken({
      anonmyousId: { enabled: true, lease: 60 },
      userToken: { cookie: false, lease: 1440 },
    });

    test('calling getUserToken before setUserToken returns anon id', () => {
      const anonToken = userTokenCookieDisabled.getUserToken();
      expect(anonToken).toContain('anon-');
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBe(anonToken);
    });

    test('setUserToken stores token and removes anon id', () => {
      const userToken = 'test-token-3';
      userTokenCookieDisabled.setUserToken(userToken);

      const got = userTokenCookieDisabled.getUserToken();

      expect(got).toBe(userToken);
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
      expect(Cookies.get(USER_TOKEN_KEY)).toBeUndefined();
    });

    test('removeUserToken removes anon id and ensures a new one is generated on next get', () => {
      userTokenCookieDisabled.setUserToken();
      userTokenCookieDisabled.getUserToken();
      userTokenCookieDisabled.removeUserToken();
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
      const anonToken = userTokenCookieDisabled.getUserToken();
      expect(anonToken).toContain('anon-');
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBe(anonToken);
    });

    test('removeUserToken removes a user token', () => {
      const userToken = 'test-token-4';
      userTokenCookieDisabled.setUserToken(userToken);
      userTokenCookieDisabled.removeUserToken();
      expect(Cookies.get(USER_TOKEN_KEY)).toBeUndefined();
    });
  });

  describe('anonymousId enabled and userToken cookie enabled', () => {
    const userTokenAllEnabled = new UserToken({
      anonmyousId: { enabled: true, lease: 60 },
      userToken: { cookie: true, lease: 1440 },
    });

    test('calling getUserToken before setUserToken returns undefined', () => {
      const token = userTokenAllEnabled.getUserToken();
      expect(token).toContain('anon-');
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBe(token);
    });

    test('calling setUserToken without any arguments generates an anon id', () => {
      userTokenAllEnabled.setUserToken();
      const userToken = userTokenAllEnabled.getUserToken();
      expect(userToken).toContain('anon-');
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBe(userToken);
    });

    test('setUserToken stores token as cookie', () => {
      const userToken = 'test-token-5';
      userTokenAllEnabled.setUserToken(userToken);

      const got = userTokenAllEnabled.getUserToken();

      expect(got).toBe(userToken);
      expect(Cookies.get(USER_TOKEN_KEY)).toBe(userToken);
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
    });

    test('removeUserToken removes anon id and ensures a new one is generated on next get', () => {
      userTokenAllEnabled.setUserToken();
      userTokenAllEnabled.getUserToken();
      userTokenAllEnabled.removeUserToken();
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
      const anonToken = userTokenAllEnabled.getUserToken();
      expect(anonToken).toContain('anon-');
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBe(anonToken);
    });

    test('removeUserToken removes a user token', () => {
      const userToken = 'test-token-5';
      userTokenAllEnabled.setUserToken(userToken);
      userTokenAllEnabled.removeUserToken();
      expect(Cookies.get(USER_TOKEN_KEY)).toBeUndefined();
    });
  });

  describe('both anonymousId and userToken cookie disabled', () => {
    const userTokenAllDisabled = new UserToken({
      anonmyousId: { enabled: false, lease: 60 },
      userToken: { cookie: false, lease: 1440 },
    });

    test('calling getUserToken before setUserToken will return undefined', () => {
      const token = userTokenAllDisabled.getUserToken();
      expect(token).toBeUndefined();
    });

    test('calling setUserToken without any arguments generates an anon id', () => {
      userTokenAllDisabled.setUserToken();
      const userToken = userTokenAllDisabled.getUserToken();
      expect(userToken).toContain('anon-');
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBe(userToken);
    });

    test('setUserToken stores token', () => {
      const userToken = 'test-token-6';
      userTokenAllDisabled.setUserToken(userToken);

      const got = userTokenAllDisabled.getUserToken();

      expect(got).toBe(userToken);
      expect(Cookies.get(USER_TOKEN_KEY)).toBeUndefined();
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
    });

    test("removeUserToken removes anon id and ensures a new one isn't generated on next get", () => {
      userTokenAllDisabled.setUserToken();
      userTokenAllDisabled.getUserToken();
      userTokenAllDisabled.removeUserToken();
      expect(Cookies.get(ANONYMOUS_ID_KEY)).toBeUndefined();
      expect(userTokenAllDisabled.getUserToken()).toBeUndefined();
    });

    test('removeUserToken removes a user token', () => {
      const userToken = 'test-token-7';
      userTokenAllDisabled.setUserToken(userToken);
      userTokenAllDisabled.removeUserToken();
      expect(Cookies.get(USER_TOKEN_KEY)).toBeUndefined();
    });
  });
});

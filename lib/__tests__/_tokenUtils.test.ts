import { getCookie } from '../_tokenUtils';
import AlgoliaAnalytics from '../insights';
import { createUUID } from '../utils/uuid';

jest.mock('../utils/uuid', () => ({
  createUUID: jest.fn(),
}));

const credentials = {
  apiKey: 'test',
  appId: 'test',
  cookieDuration: 10 * 24 * 3600 * 1000, // 10 days
};

const DAY = 86400000; /* 1 day in ms*/
const DATE_TOMORROW = new Date(Date.now() + DAY).toUTCString();
const DATE_YESTERDAY = new Date(Date.now() - DAY).toUTCString();

describe('tokenUtils', () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({
      requestFn: () => {},
    });
    analyticsInstance.init(credentials);
    (createUUID as jest.Mock).mockReset();
    (createUUID as jest.Mock)
      .mockReturnValueOnce('mock-uuid-1')
      .mockReturnValueOnce('mock-uuid-2')
      .mockReturnValue('mock-uuid-2+');
    // clear cookies
    document.cookie = '_ALGOLIA=;expires=Thu, 01-Jan-1970 00:00:01 GMT;';
  });
  describe('setUserToken', () => {
    describe('anonymous userToken', () => {
      it('should create a cookie with a UUID', () => {
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe('_ALGOLIA=anonymous-mock-uuid-1');
      });
      it('should reuse previously created UUID', () => {
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe('_ALGOLIA=anonymous-mock-uuid-1');
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe('_ALGOLIA=anonymous-mock-uuid-1');
      });
      it('should not reuse UUID from an expired cookie', () => {
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe('_ALGOLIA=anonymous-mock-uuid-1');
        // set cookie as expired
        document.cookie = '_ALGOLIA=;expires=Thu, 01-Jan-1970 00:00:01 GMT;';
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe('_ALGOLIA=anonymous-mock-uuid-2');
      });
    });
    describe('provided userToken', () => {
      it('should not create a cookie with provided userToken', () => {
        analyticsInstance.setUserToken('007');
        expect(document.cookie).toBe('');
      });
      it('create a anonymous cookie when switching from provided userToken to anonymous', () => {
        analyticsInstance.setUserToken('007');
        expect(document.cookie).toBe('');
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe('_ALGOLIA=anonymous-mock-uuid-1');
      });
      it('should preserve the cookie with same uuid when userToken provided after anonymous', () => {
        analyticsInstance.setAnonymousUserToken();
        expect(document.cookie).toBe('_ALGOLIA=anonymous-mock-uuid-1');
        analyticsInstance.setUserToken('007');
        expect(document.cookie).toBe('_ALGOLIA=anonymous-mock-uuid-1');
      });
    });
  });
  describe('getUserToken', () => {
    beforeEach(() => {
      analyticsInstance.setUserToken('007');
    });
    it('should return the current userToken', () => {
      const userToken = analyticsInstance.getUserToken();
      expect(userToken).toEqual('007');
    });
    it('should accept a callback', () => {
      analyticsInstance.getUserToken({}, (err, userToken) => {
        expect(err).toEqual(null);
        expect(userToken).toEqual('007');
      });
    });

    describe('getCookie', () => {
      it("should return '' _ALGOLIA cookie when not available", () => {
        document.cookie = `_ALGOLIA=value;expires=${DATE_YESTERDAY};path=/`;
        expect(getCookie('_ALGOLIA')).toEqual('');
      });
      it('should get _ALGOLIA cookie when available', () => {
        document.cookie = `_ALGOLIA=value;expires=${DATE_TOMORROW};path=/`;

        expect(getCookie('_ALGOLIA')).toEqual('value');
      });
      it('should not care about other cookie if malformed', () => {
        document.cookie = `_ALGOLIA=value;expires=${DATE_TOMORROW};path=/`;
        document.cookie = `BAD_COOKIE=val%ue;expires=${DATE_TOMORROW};path=/`;

        expect(getCookie('_ALGOLIA')).toEqual('value');
      });
    });
  });
});

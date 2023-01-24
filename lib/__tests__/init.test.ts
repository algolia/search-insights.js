import { getCookie } from '../_tokenUtils';
import AlgoliaAnalytics from '../insights';
// `import * as utils from "../utils"` results in an error when used in
// `jest.spyOn(utils, "supportsCookies")`. Workaround:
// https://github.com/aelbore/esbuild-jest/issues/26#issuecomment-893763840
import { supportsCookies } from '../utils';

const utils = { supportsCookies };

describe('init', () => {
  let analyticsInstance: AlgoliaAnalytics;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
    document.cookie = `_ALGOLIA=;${new Date().toUTCString()};path=/`;
  });

  it('should throw if no parameters is passed', () => {
    expect(() => {
      (analyticsInstance as any).init();
    }).toThrowErrorMatchingInlineSnapshot(
      `"Init function should be called with an object argument containing your apiKey and appId"`
    );
  });
  it('should throw if apiKey is not sent', () => {
    expect(() => {
      (analyticsInstance as any).init({ appId: '***' });
    }).toThrowErrorMatchingInlineSnapshot(
      `"apiKey is missing, please provide it so we can authenticate the application"`
    );
  });
  it('should throw if appId is not sent', () => {
    expect(() => {
      (analyticsInstance as any).init({ apiKey: '***' });
    }).toThrowErrorMatchingInlineSnapshot(
      `"appId is missing, please provide it, so we can properly attribute data to your application"`
    );
  });
  it('should throw if region is other than `de` | `us`', () => {
    expect(() => {
      (analyticsInstance as any).init({
        appId: 'xxx',
        apiKey: '***',
        region: 'emea',
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"optional region is incorrect, please provide either one of: de, us."`
    );
  });
  it('should set _appId on instance', () => {
    analyticsInstance.init({ apiKey: '***', appId: 'XXX' });
    expect(analyticsInstance._appId).toBe('XXX');
  });
  it('should set _apiKey on instance', () => {
    analyticsInstance.init({ apiKey: '***', appId: 'XXX' });
    expect(analyticsInstance._apiKey).toBe('***');
  });
  it('should set _region on instance', () => {
    analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'us' });
    expect(analyticsInstance._region).toBe('us');
  });
  it('should set _userHasOptedOut on instance to false by default', () => {
    analyticsInstance.init({ apiKey: '***', appId: 'XXX' });
    expect(analyticsInstance._userHasOptedOut).toBe(false);
  });
  it('should set _userHasOptedOut on instance when passed', () => {
    analyticsInstance.init({
      apiKey: '***',
      appId: 'XXX',
      userHasOptedOut: true,
    });
    expect(analyticsInstance._userHasOptedOut).toBe(true);
  });
  it('should not set anonymous user token when _userHasOptedOut is true', () => {
    analyticsInstance.init({
      apiKey: '***',
      appId: 'XXX',
      userHasOptedOut: true,
    });
    expect(analyticsInstance._userToken).toBeUndefined();
    expect(getCookie('_ALGOLIA')).toBe('');
  });
  it('should use 6 months cookieDuration by default', () => {
    analyticsInstance.init({ apiKey: '***', appId: 'XXX' });
    const month = 30 * 24 * 60 * 60 * 1000;
    expect(analyticsInstance._cookieDuration).toBe(6 * month);
  });
  it.each(['not a string', 0.002, NaN])(
    'should throw if cookieDuration passed but is not an integer (eg. %s)',
    (cookieDuration) => {
      expect(() => {
        (analyticsInstance as any).init({
          cookieDuration,
          apiKey: '***',
          appId: 'XXX',
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"optional cookieDuration is incorrect, expected an integer."`
      );
    }
  );
  it('should use passed cookieDuration', () => {
    analyticsInstance.init({
      apiKey: '***',
      appId: 'XXX',
      cookieDuration: 42,
    });
    expect(analyticsInstance._cookieDuration).toBe(42);
  });
  it('should set _endpointOrigin on instance to https://insights.algolia.io', () => {
    analyticsInstance.init({ apiKey: '***', appId: 'XXX' });
    expect(analyticsInstance._endpointOrigin).toBe(
      'https://insights.algolia.io'
    );
  });
  it("should set _endpointOrigin on instance to https://insights.us.algolia.io if region === 'us'", () => {
    analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'us' });
    expect(analyticsInstance._endpointOrigin).toBe(
      'https://insights.us.algolia.io'
    );
  });
  it("should set _endpointOrigin on instance to https://insights.de.algolia.io if region === 'de'", () => {
    analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'de' });
    expect(analyticsInstance._endpointOrigin).toBe(
      'https://insights.de.algolia.io'
    );
  });
  it('should set anonymous userToken if environment supports cookies', () => {
    const supportsCookies = jest
      .spyOn(utils, 'supportsCookies')
      .mockReturnValue(true);
    const setAnonymousUserToken = jest.spyOn(
      analyticsInstance,
      'setAnonymousUserToken'
    );

    analyticsInstance.init({
      apiKey: '***',
      appId: 'XXX',
      region: 'de',
      useCookie: true,
    });
    expect(setAnonymousUserToken).toHaveBeenCalledTimes(1);

    setAnonymousUserToken.mockRestore();
    supportsCookies.mockRestore();
  });
  it('should not set anonymous userToken if environment does not supports cookies', () => {
    const supportsCookies = jest
      .spyOn(utils, 'supportsCookies')
      .mockReturnValue(false);
    const setUserToken = jest.spyOn(analyticsInstance, 'setUserToken');

    analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'de' });
    expect(setUserToken).not.toHaveBeenCalled();

    setUserToken.mockRestore();
    supportsCookies.mockRestore();
  });
  it('should not set anonymous userToken if useCookie is false', () => {
    const supportsCookies = jest
      .spyOn(utils, 'supportsCookies')
      .mockReturnValue(true);
    const setAnonymousUserToken = jest.spyOn(
      analyticsInstance,
      'setAnonymousUserToken'
    );

    analyticsInstance.init({
      apiKey: '***',
      appId: 'XXX',
      region: 'de',
      useCookie: false,
    });
    expect(setAnonymousUserToken).not.toHaveBeenCalled();

    setAnonymousUserToken.mockRestore();
    supportsCookies.mockRestore();
  });
  it('should not set anonymous userToken if a token is already set', () => {
    const setUserToken = jest.spyOn(analyticsInstance, 'setUserToken');
    analyticsInstance.init({
      apiKey: '***',
      appId: 'XXX',
      useCookie: true,
    });
    expect(setUserToken).toHaveBeenCalledTimes(1);
    expect(setUserToken).toHaveBeenCalledWith(
      expect.stringMatching(/^anonymous-/)
    );

    analyticsInstance.setUserToken('my-token');
    expect(setUserToken).toHaveBeenCalledTimes(2);
    expect(setUserToken).toHaveBeenLastCalledWith('my-token');

    analyticsInstance.init({
      apiKey: '***',
      appId: 'XXX',
    });
    expect(setUserToken).toHaveBeenCalledTimes(2);

    setUserToken.mockRestore();
  });

  describe('callback for userToken', () => {
    describe('immediate: true', () => {
      it('should trigger callback when userToken is set with cookie support', () => {
        const supportsCookies = jest
          .spyOn(utils, 'supportsCookies')
          .mockReturnValue(true);

        analyticsInstance.init({
          apiKey: '***',
          appId: 'XXX',
          region: 'de',
          useCookie: true,
        });
        // Because cookie is enabled, anonymous token must be generated already.
        expect(analyticsInstance._userToken).toBeTruthy();
        expect(analyticsInstance._userToken.length).toBeGreaterThan(0);
        const callback = jest.fn();
        analyticsInstance.onUserTokenChange(callback, { immediate: true });
        expect(callback).toHaveBeenCalledWith(analyticsInstance._userToken); // anonymous user token
        expect(callback).toHaveBeenCalledTimes(1);

        analyticsInstance.setUserToken('abc');
        expect(callback).toHaveBeenCalledWith('abc'); // explicit user token
        supportsCookies.mockRestore();
      });

      it('should trigger callback when userToken is set without cookie support', () => {
        const supportsCookies = jest
          .spyOn(utils, 'supportsCookies')
          .mockReturnValue(false);

        analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'de' });
        const callback = jest.fn();
        analyticsInstance.onUserTokenChange(callback, { immediate: true });
        expect(callback).toHaveBeenCalledWith(undefined);
        expect(callback).toHaveBeenCalledTimes(1);

        analyticsInstance.setUserToken('abc');
        expect(callback).toHaveBeenCalledWith('abc');
        expect(callback).toHaveBeenCalledTimes(2);
        supportsCookies.mockRestore();
      });
    });

    describe('immediate: false', () => {
      it('should trigger callback when userToken is set', () => {
        analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'de' });
        analyticsInstance.setUserToken('abc');

        const callback = jest.fn();
        analyticsInstance.onUserTokenChange(callback);
        expect(callback).toHaveBeenCalledTimes(0);

        analyticsInstance.setUserToken('def');
        expect(callback).toHaveBeenCalledWith('def');
        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('is triggered by setAnonymousUserToken', () => {
        analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'de' });

        const callback = jest.fn();
        analyticsInstance.onUserTokenChange(callback);
        expect(callback).toHaveBeenCalledTimes(0);

        analyticsInstance.setAnonymousUserToken();
        expect(callback).toHaveBeenCalledWith(
          expect.stringMatching(/^anonymous-[-\w]+$/)
        );
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    describe('nullish or invalid callback', () => {
      it('should not throw an exception when setting nullish callback', () => {
        analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'de' });
        analyticsInstance.setUserToken('abc');

        expect(() => {
          analyticsInstance.onUserTokenChange(undefined);
        }).not.toThrow();

        expect(() => {
          analyticsInstance.onUserTokenChange(undefined, { immediate: true });
        }).not.toThrow();
      });

      it('should not throw an exception when setting user token after setting invalid callback', () => {
        analyticsInstance.init({ apiKey: '***', appId: 'XXX', region: 'de' });
        // @ts-expect-error wrong parameter
        analyticsInstance.onUserTokenChange('this is not a function');

        expect(() => {
          analyticsInstance.setUserToken('abc');
        }).not.toThrow();
      });
    });
  });

  describe('userToken param', () => {
    let setUserToken;
    let setAnonymousUserToken;
    beforeEach(() => {
      setUserToken = jest.spyOn(analyticsInstance, 'setUserToken');
      setAnonymousUserToken = jest.spyOn(
        analyticsInstance,
        'setAnonymousUserToken'
      );
    });

    afterEach(() => {
      setUserToken.mockRestore();
      setAnonymousUserToken.mockRestore();
    });

    it('should set userToken', () => {
      analyticsInstance.init({ apiKey: '***', appId: 'XXX', userToken: 'abc' });
      expect(setUserToken).toHaveBeenCalledTimes(1);
      expect(setUserToken).toHaveBeenCalledWith('abc');
    });

    it("shouldn't set anonymous user token to cookie", () => {
      analyticsInstance.init({
        apiKey: '***',
        appId: 'XXX',
        userToken: 'abc',
        useCookie: true,
      });
      expect(setUserToken).toHaveBeenCalledTimes(1);
      expect(setUserToken).toHaveBeenCalledWith('abc');

      expect(setAnonymousUserToken).not.toHaveBeenCalled();
    });

    it('can set userToken manually afterwards', (done) => {
      analyticsInstance.init({ apiKey: '***', appId: 'XXX', userToken: 'abc' });
      analyticsInstance.setUserToken('def');
      expect(setUserToken).toHaveBeenCalledTimes(2);
      expect(setUserToken).toHaveBeenLastCalledWith('def');
      analyticsInstance.getUserToken(null, (_err, value) => {
        expect(value).toEqual('def');
        done();
      });
    });
  });
});

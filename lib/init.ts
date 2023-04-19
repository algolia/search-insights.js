import { DEFAULT_ALGOLIA_AGENTS } from './_algoliaAgent';
import { isUndefined, isString, isNumber } from './utils';

type InsightRegion = 'de' | 'us';
const SUPPORTED_REGIONS: InsightRegion[] = ['de', 'us'];
const MONTH = 30 * 24 * 60 * 60 * 1000;

export interface InitParams {
  apiKey: string;
  appId: string;
  userHasOptedOut?: boolean;
  useCookie?: boolean;
  cookieDuration?: number;
  region?: InsightRegion;
  userToken?: string;
  host?: string;
}

function assignInitialParams(options: InitParams) {
  this._apiKey = options.apiKey;
  this._appId = options.appId;
  this._userHasOptedOut = Boolean(options.userHasOptedOut);
  this._region = options.region;
  this._endpointOrigin =
    options.host ||
    (options.region
      ? `https://insights.${options.region}.algolia.io`
      : 'https://insights.algolia.io');
  this._useCookie = options.useCookie ?? false;
  this._cookieDuration = options.cookieDuration
    ? options.cookieDuration
    : 6 * MONTH;
  // Set hasCredentials
  this._hasCredentials = true;
}

/**
 * Binds credentials and settings to class.
 *
 * @param options - `init` options. Must provide `apiKey` and `appId` properties.
 */
export function init(options: InitParams) {
  if (!options) {
    throw new Error(
      'Init function should be called with an object argument containing your apiKey and appId'
    );
  }
  if (isUndefined(options.apiKey) || !isString(options.apiKey)) {
    throw new Error(
      'apiKey is missing, please provide it so we can authenticate the application'
    );
  }
  if (isUndefined(options.appId) || !isString(options.appId)) {
    throw new Error(
      'appId is missing, please provide it, so we can properly attribute data to your application'
    );
  }
  if (
    !isUndefined(options.region) &&
    SUPPORTED_REGIONS.indexOf(options.region) === -1
  ) {
    throw new Error(
      `optional region is incorrect, please provide either one of: ${SUPPORTED_REGIONS.join(
        ', '
      )}.`
    );
  }
  if (
    !isUndefined(options.cookieDuration) &&
    (!isNumber(options.cookieDuration) ||
      !isFinite(options.cookieDuration) ||
      Math.floor(options.cookieDuration) !== options.cookieDuration)
  ) {
    throw new Error(
      `optional cookieDuration is incorrect, expected an integer.`
    );
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.info(`Since v2.0.4, search-insights no longer validates event payloads.
You can visit https://algolia.com/events/debugger instead.`);
  }

  assignInitialParams.call(this, options);

  // user agent
  this._ua = [...DEFAULT_ALGOLIA_AGENTS];

  if (options.userToken) {
    this.setUserToken(options.userToken);
  } else if (!this._userToken && !this._userHasOptedOut && this._useCookie) {
    this.setAnonymousUserToken();
  }
}

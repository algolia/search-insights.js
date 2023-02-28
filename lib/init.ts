import { isUndefined, isString, isNumber } from "./utils";
import { DEFAULT_ALGOLIA_AGENTS } from "./_algoliaAgent";
import objectAssignPolyfill from "./polyfills/objectAssign";

objectAssignPolyfill();

type InsightRegion = "de" | "us";
const SUPPORTED_REGIONS: InsightRegion[] = ["de", "us"];
const MONTH = 30 * 24 * 60 * 60 * 1000;

export interface InitParams {
  apiKey: string;
  appId: string;
  userHasOptedOut?: boolean;
  useCookie?: boolean;
  cookieDuration?: number;
  region?: InsightRegion;
  userToken?: string;
  patch?: boolean;
}

/**
 * Binds credentials and settings to class
 * @param options: initParams
 */
export function init(options: InitParams) {
  if (!options) {
    throw new Error(
      "Init function should be called with an object argument containing your apiKey and appId"
    );
  }
  if (isUndefined(options.apiKey) || !isString(options.apiKey)) {
    throw new Error(
      "apiKey is missing, please provide it so we can authenticate the application"
    );
  }
  if (isUndefined(options.appId) || !isString(options.appId)) {
    throw new Error(
      "appId is missing, please provide it, so we can properly attribute data to your application"
    );
  }
  if (
    !isUndefined(options.region) &&
    SUPPORTED_REGIONS.indexOf(options.region) === -1
  ) {
    throw new Error(
      `optional region is incorrect, please provide either one of: ${SUPPORTED_REGIONS.join(
        ", "
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
    console.info(`Since v2.0.4, search-insights no longer validates event payloads.
You can visit https://algolia.com/events/debugger instead.`);
  }

  this._apiKey = options.apiKey;
  this._appId = options.appId;

  setOptions(this, options, {
    _userHasOptedOut: !!options.userHasOptedOut,
    _region: options.region,
    _useCookie: options.useCookie ?? false,
    _cookieDuration: options.cookieDuration || 6 * MONTH
  });

  this._endpointOrigin = options.region
    ? `https://insights.${options.region}.algolia.io`
    : "https://insights.algolia.io";

  // Set hasCredentials
  this._hasCredentials = true;

  // user agent
  this._ua = [...DEFAULT_ALGOLIA_AGENTS];

  if (options.userToken) {
    this.setUserToken(options.userToken);
  } else if (!this._userToken && !this._userHasOptedOut && this._useCookie) {
    this.setAnonymousUserToken();
  }
}

type ThisParams = {
  _userHasOptedOut: InitParams["userHasOptedOut"];
  _useCookie: InitParams["useCookie"];
  _cookieDuration: InitParams["cookieDuration"];
  _region: InitParams["region"];
};

function setOptions(
  target: ThisParams,
  { patch, ...options }: InitParams,
  defaultValues: ThisParams
) {
  if (!patch) {
    Object.assign(target, defaultValues);
  }

  Object.assign(
    target,
    Object.keys(options).reduce(
      (acc, key) => ({ ...acc, [`_${key}`]: options[key] }),
      {}
    )
  );
}

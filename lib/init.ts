import { isUndefined, isNumber } from "./utils";
import { DEFAULT_ALGOLIA_AGENT } from "./_algoliaAgent";
import objectAssignPolyfill from "./polyfills/objectAssign";
import { MONTH } from "./_tokenUtils";

objectAssignPolyfill();

type InsightRegion = "de" | "us";
const SUPPORTED_REGIONS: InsightRegion[] = ["de", "us"];

export interface InitParams {
  apiKey?: string;
  appId?: string;
  userHasOptedOut?: boolean;
  useCookie?: boolean;
  cookieDuration?: number;
  region?: InsightRegion;
  userToken?: string;
  partial?: boolean;
}

/**
 * Binds credentials and settings to class
 * @param options: initParams
 */
export function init(options: InitParams = {}) {
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

  setOptions(this, options, {
    _userHasOptedOut: !!options.userHasOptedOut,
    _region: options.region,
    _useCookie: options.useCookie ?? true,
    _cookieDuration: options.cookieDuration || 6 * MONTH
  });

  this._endpointOrigin = options.region
    ? `https://insights.${options.region}.algolia.io`
    : "https://insights.algolia.io";

  // user agent
  this._ua = DEFAULT_ALGOLIA_AGENT;
  this._uaURIEncoded = encodeURIComponent(DEFAULT_ALGOLIA_AGENT);

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
  { partial: partial, ...options }: InitParams,
  defaultValues: ThisParams
) {
  if (!partial) {
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

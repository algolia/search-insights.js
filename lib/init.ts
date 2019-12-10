import { isUndefined, isString, isNumber, supportsCookies } from "./utils";
import { DEFAULT_ALGOLIA_AGENT } from "./_algoliaAgent";

type InsightRegion = "de" | "us";
const SUPPORTED_REGIONS: InsightRegion[] = ["de", "us"];
const MONTH = 30 * 24 * 60 * 60 * 1000;

export interface InitParams {
  apiKey: string;
  appId: string;
  userHasOptedOut?: boolean;
  cookieDuration?: number;
  region?: InsightRegion;
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

  this._apiKey = options.apiKey;
  this._appId = options.appId;
  this._userHasOptedOut = !!options.userHasOptedOut;
  this._region = options.region;
  this._endpointOrigin = options.region
    ? `https://insights.${options.region}.algolia.io`
    : "https://insights.algolia.io";

  this._cookieDuration = options.cookieDuration
    ? options.cookieDuration
    : 6 * MONTH;
  // Set hasCredentials
  this._hasCredentials = true;

  // user agent
  this._ua = DEFAULT_ALGOLIA_AGENT;
  this._uaURIEncoded = encodeURIComponent(DEFAULT_ALGOLIA_AGENT);

  if (supportsCookies()) {
    try {
      this.reuseUserTokenStoredInCookies();
    } catch (e) {
      // create the anonymous cookie
      this.setUserToken(this.ANONYMOUS_USER_TOKEN);
    }
  }
}

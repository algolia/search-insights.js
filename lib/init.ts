import { isUndefined, isString } from "./utils/index";
import { userToken } from "./_cookieUtils";
import { isNumber } from "util";

type InsightRegion = "de" | "us";
const SUPPORTED_REGIONS: InsightRegion[] = ["de", "us"];
const MONTH = 30 * 24 * 60 * 60 * 1000;

export interface InitParams {
  apiKey: string;
  applicationID: string;
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
      "Init function should be called with an object argument containing your apiKey and applicationID"
    );
  }
  if (isUndefined(options.apiKey) || !isString(options.apiKey)) {
    throw new Error(
      "apiKey is missing, please provide it so we can authenticate the application"
    );
  }
  if (isUndefined(options.applicationID) || !isString(options.applicationID)) {
    throw new Error(
      "applicationID is missing, please provide it, so we can properly attribute data to your application"
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
    (!isNumber(options.cookieDuration) || !isFinite(options.cookieDuration) || Math.floor(options.cookieDuration) !== options.cookieDuration)
  ) {
    throw new Error(
      `optional cookieDuration is incorrect, expected an integer`
    );
  }

  this._apiKey = options.apiKey;
  this._applicationID = options.applicationID;
  this._userHasOptedOut = !!options.userHasOptedOut;
  this._region = options.region;
  this._endpointOrigin = options.region
    ? `https://insights.${options.region}.algolia.io`
    : "https://insights.algolia.io";

  // Set hasCredentials
  this._hasCredentials = true;

  const cookieDuration = options.cookieDuration
    ? options.cookieDuration
    : 6 * MONTH;

  this._userToken = userToken(null, cookieDuration);
}

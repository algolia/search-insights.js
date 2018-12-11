import { isUndefined, isString } from "./utils/index";

type InsightRegion = "de" | "us";
const SUPPORTED_REGIONS: InsightRegion[] = ["de", "us"];

export interface InitParams {
  apiKey: string;
  applicationID: string;
  region?: InsightRegion;
  endpointOrigin?: string;
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

  this._apiKey = options.apiKey;
  this._applicationID = options.applicationID;
  this._region = options.region;
  this._endpointOrigin = options.region
    ? `https://insights.${options.region}.algolia.io`
    : "https://insights.algolia.io";

  // Set hasCredentials
  this._hasCredentials = true;
}

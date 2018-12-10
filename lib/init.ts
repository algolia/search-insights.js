import { isUndefined, isString } from "./utils/index";

export interface InitParams {
  apiKey: string;
  applicationID: string;
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

  this._apiKey = options.apiKey;
  this._applicationID = options.applicationID;

  // Set hasCredentials
  this._hasCredentials = true;
}

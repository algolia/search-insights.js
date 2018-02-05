
export interface initParams {
  apiKey: string;
  applicationID: string;
}

/**
 * Binds credentials and settings to class
 * @param options: initParams
 */
export function init(options: initParams){
  if(!options) {
    throw new Error('Init function should be called with an object argument containing your apiKey and applicationID');

  } else if(!options.apiKey || typeof options.apiKey !== 'string'){
    throw new Error('apiKey is missing, please provide it so we can authenticate the application');

  } else if(!options.applicationID || typeof options.applicationID !== 'string') {
    throw new Error('applicationID is missing, please provide it, so we can properly attribute data to your application');
  }

  this._apiKey = options.apiKey;
  this._applicationID = options.applicationID;

  // Set hasCredentials
  this._hasCredentials = true;
}
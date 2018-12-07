export interface InsightsSearchConversionEvent {
  eventName: string;
  userID: string;
  timestamp: number;
  index: string;

  queryID: string;
  objectIDs: (string | number)[];
}

/**
 * Checks params for conversion report and sends query
 * @param params InsightsSearchConversionEvent
 */
export function conversion(params: InsightsSearchConversionEvent) {
  if (!this._hasCredentials) {
    throw new Error(
      "Before calling any methods on the analytics, you first need to call the 'init' function with applicationID and apiKey parameters"
    );
  } else if (!params) {
    throw new Error(
      "No parameters were sent to conversion event, please provide a queryID and objectIDs"
    );
  } else if (!params.queryID) {
    throw new Error(
      "No parameters were sent to conversion event, please provide a queryID"
    );
  } else if (!params.objectIDs) {
    throw new Error(
      "No objectIDs was sent to conversion event, please provide objectIDs"
    );
  }

  // Get associated queryID
  const queryID = params.queryID;

  // Reassign params
  const conversionParams = Object.assign(params, { queryID });

  // Send event
  this.sendEvent("conversion", conversionParams);
}

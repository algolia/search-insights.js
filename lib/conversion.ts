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
  if (!params) {
    throw new Error(
      "No params were sent to conversion function, please provide `queryID` and `objectIDs` to be reported"
    );
  }
  if (!params.queryID) {
    throw new Error(
      "required queryID parameter was not sent, conversion event can not be properly sent without"
    );
  }
  if (!params.objectIDs) {
    throw new Error(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  }

  // Send event
  this.sendEvent("conversion", params);
}

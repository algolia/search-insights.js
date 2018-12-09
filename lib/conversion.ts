import { InsightsEvent } from "./_sendEvent";

export interface InsightsSearchConversionEvent {
  eventName: string;
  userID: string;
  timestamp: number;
  index: string;

  queryID: string;
  objectIDs: (string | number)[];
}

/**
 * Sends a conversion report in the context of search
 * @param params InsightsSearchConversionEvent
 */
export function convertedObjectIDInSearch(
  params: InsightsSearchConversionEvent
) {
  if (!params) {
    throw new Error(
      "No params were sent to convertedObjectIDInSearch function, please provide `queryID` and `objectIDs` to be reported"
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

  this.sendEvent("conversion", params as InsightsEvent);
}

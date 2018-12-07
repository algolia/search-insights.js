export interface InsightsSearchClickEvent {
  eventName: string;
  userID: string;
  timestamp: number;
  index: string;

  queryID: string;
  objectIDs: (string | number)[];
  positions: number[];
}

/**
 * Sends a click report
 * @param params: InsightsSearchClickEvent
 */
export function click(params: InsightsSearchClickEvent) {
  if (!this._hasCredentials) {
    throw new Error(
      "Before calling any methods on the analytics, you first need to call the 'init' function with applicationID and apiKey parameters"
    );
  }
  if (!params) {
    throw new Error(
      "No params were sent to click function, please provide `queryID`,  `objectIDs` and `positions` to be reported"
    );
  }
  if (!params.queryID) {
    throw new Error(
      "required queryID parameter was not sent, click event can not be properly sent without"
    );
  }
  if (!params.objectIDs) {
    throw new Error(
      "required objectIDs parameter was not sent, click event can not be properly sent without"
    );
  }
  if (!params.positions) {
    throw new Error(
      "required positions parameter was not sent, click event can not be properly sent without"
    );
  }

  // Send event
  this.sendEvent("click", params);
}

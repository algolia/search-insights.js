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

  // Get last queryID
  let queryID = params.queryID;

  if (typeof this.getQueryID === "function" && !queryID) {
    queryID = this.getQueryID() || this._lastQueryID;
  }

  // Abort if no queryID
  if (!queryID) {
    throw new Error(`No queryID was retrieved, please check the implementation and provide either a getQueryID function
    or call the search method that will return the queryID parameter`);
  }

  // Merge queryID to params
  const clickParams = Object.assign({}, params, { queryID });

  // Send event
  this.sendEvent("click", clickParams);
}

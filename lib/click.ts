import { InsightsEvent } from './_sendEvent';

export interface InsightsSearchClickEvent extends InsightsEvent {
  objectID: string | number;
  position: number;
  queryID?: string;
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
  } else if (!params) {
    throw new Error(
      'No params were sent to click function, please provide an objectID and position to be reported'
    );
  } else if (!params.objectID) {
    throw new Error(
      'required objectID parameter was not sent, click event can not be properly attributed'
    );
  } else if (!params.position) {
    throw new Error(
      'required position parameter was not sent, click event position can not be properly sent without'
    );
  }

  // Get last queryID
  let queryID = params.queryID;

  if (typeof this.getQueryID === 'function' && !queryID) {
    queryID = this.getQueryID() || this._lastQueryID;
  }

  // Abort if no queryID
  if (!queryID) {
    throw new Error(`No queryID was retrieved, please check the implementation and provide either a getQueryID function
    or call the search method that will return the queryID parameter`);
  }

  // Store click to localstorage
  this.storageManager.storeClick(params.objectID, queryID);

  // Merge queryID to params
  const clickParams = Object.assign({}, params, { queryID });

  // Send event
  this.sendEvent('click', clickParams);
}

import { InsightsEvent } from "./_sendEvent";

export interface InsightsSearchClickEvent {
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: (string | number)[];
  positions: number[];
}

/**
 * Sends a click report in the context of search
 * @param params: InsightsSearchClickEvent
 */
export function clickedObjectIDsAfterSearch(params: InsightsSearchClickEvent) {
  if (!params) {
    throw new Error(
      "No params were sent to clickedObjectIDsAfterSearch function, please provide `queryID`,  `objectIDs` and `positions` to be reported"
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

  this.sendEvent("click", params as InsightsEvent);
}

export interface InsightsClickObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: (string | number)[];
}

/**
 * Sends a click report using objectIDs
 * @param params: InsightsClickObjectIDsEvent
 */
export function clickedObjectIDs(params: InsightsClickObjectIDsEvent) {
  if (!params) {
    throw new Error(
      "No params were sent to clickedObjectIDs function, please provide `objectIDs` to be reported"
    );
  }
  if (!params.objectIDs) {
    throw new Error(
      "required `objectIDs` parameter was not sent, click event can not be properly sent without"
    );
  }

  this.sendEvent("click", params as InsightsEvent);
}

export interface InsightsClickFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

/**
 * Sends a click report using filters
 * @param params: InsightsClickFiltersEvent
 */
export function clickedFilters(params: InsightsClickFiltersEvent) {
  if (!params) {
    throw new Error(
      "No params were sent to clickedFilters function, please provide `filters` to be reported"
    );
  }
  if (!params.filters) {
    throw new Error(
      "required `filters` parameter was not sent, click event can not be properly sent without"
    );
  }

  this.sendEvent("click", params as InsightsEvent);
}

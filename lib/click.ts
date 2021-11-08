export interface InsightsSearchClickEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: string[];
  positions: number[];
}

/**
 * Sends a click report in the context of search
 * @param params: InsightsSearchClickEvent
 */
export function clickedObjectIDsAfterSearch(params: InsightsSearchClickEvent) {
  this.sendEvent({ eventType: "click", ...params });
}

export interface InsightsClickObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}

/**
 * Sends a click report using objectIDs, outside the context of a search
 * @param params: InsightsClickObjectIDsEvent
 */
export function clickedObjectIDs(params: InsightsClickObjectIDsEvent) {
  this.sendEvent({ eventType: "click", ...params });
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
  this.sendEvent({ eventType: "click", ...params });
}

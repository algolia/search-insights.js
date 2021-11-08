export interface InsightsSearchViewObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}
/**
 * Sends a view report using objectIDs
 * @param params InsightsSearchViewObjectIDsEvent
 */
export function viewedObjectIDs(params: InsightsSearchViewObjectIDsEvent) {
  this.sendEvent({ eventType: "view", ...params });
}

export interface InsightsSearchViewFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}
/**
 * Sends a view report using filters
 * @param params InsightsSearchViewFiltersEvent
 */
export function viewedFilters(params: InsightsSearchViewFiltersEvent) {
  this.sendEvent({ eventType: "view", ...params });
}

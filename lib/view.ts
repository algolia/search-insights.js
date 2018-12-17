import { InsightsEvent } from "./_sendEvent";

export interface InsightsViewObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: (string | number)[];
}
/**
 * Sends a view report using objectIDs
 * @param params InsightsViewObjectIDsEvent
 */
export function viewedObjectIDs(params: InsightsViewObjectIDsEvent) {
  if (!params) {
    throw new Error(
      "No params were sent to viewedObjectIDs function, please provide `objectIDs` to be reported"
    );
  }
  if (!params.objectIDs) {
    throw new Error(
      "required objectIDs parameter was not sent, view event can not be properly sent without"
    );
  }

  this.sendEvent("view", params as InsightsEvent);
}

export interface InsightsViewFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}
/**
 * Sends a view report using filters
 * @param params InsightsViewFiltersEvent
 */
export function viewedFilters(params: InsightsViewFiltersEvent) {
  if (!params) {
    throw new Error(
      "No params were sent to viewedFilters function, please provide `filters` to be reported"
    );
  }
  if (!params.filters) {
    throw new Error(
      "required filters parameter was not sent, view event can not be properly sent without"
    );
  }

  this.sendEvent("view", params as InsightsEvent);
}

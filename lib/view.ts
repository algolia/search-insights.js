import { InsightsEvent } from "./_sendEvent";
import { RequestCallback } from "./utils/request";

export interface InsightsSearchViewObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: (string | number)[];
}
/**
 * Sends a view report using objectIDs
 * @param params InsightsSearchViewObjectIDsEvent
 */
export function viewedObjectIDs(
  params: InsightsSearchViewObjectIDsEvent,
  callback?: RequestCallback
) {
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

  this.sendEvent("view", params as InsightsEvent, callback);
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
export function viewedFilters(
  params: InsightsSearchViewFiltersEvent,
  callback?: RequestCallback
) {
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

  this.sendEvent("view", params as InsightsEvent, callback);
}

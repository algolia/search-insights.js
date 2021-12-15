import AlgoliaAnalytics from "./insights";
import { addEventType } from "./_addEventType";

export interface InsightsSearchViewObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}

export function viewedObjectIDs(
  this: AlgoliaAnalytics,
  ...params: InsightsSearchViewObjectIDsEvent[]
) {
  return this.sendEvents(addEventType("view", params));
}

export interface InsightsSearchViewFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

export function viewedFilters(
  this: AlgoliaAnalytics,
  ...params: InsightsSearchViewFiltersEvent[]
) {
  return this.sendEvents(addEventType("view", params));
}

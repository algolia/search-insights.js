import { addEventType } from "./_addEventType";

export interface InsightsSearchClickEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: string[];
  positions: number[];
}

export function clickedObjectIDsAfterSearch(
  ...params: InsightsSearchClickEvent[]
) {
  return this.sendEvents(addEventType("click", params));
}

export interface InsightsClickObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}

export function clickedObjectIDs(...params: InsightsClickObjectIDsEvent[]) {
  return this.sendEvents(addEventType("click", params));
}

export interface InsightsClickFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

export function clickedFilters(...params: InsightsClickFiltersEvent[]) {
  return this.sendEvents(addEventType("click", params));
}

import { addEventType } from "./_addEventType";
export interface InsightsSearchConversionEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: string[];
}

export function convertedObjectIDsAfterSearch(
  ...params: InsightsSearchConversionEvent[]
) {
  return this.sendEvents(addEventType("conversion", params));
}

export interface InsightsSearchConversionObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}

export function convertedObjectIDs(
  ...params: InsightsSearchConversionObjectIDsEvent[]
) {
  return this.sendEvents(addEventType("conversion", params));
}

export interface InsightsSearchConversionFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

export function convertedFilters(
  ...params: InsightsSearchConversionFiltersEvent[]
) {
  return this.sendEvents(addEventType("conversion", params));
}

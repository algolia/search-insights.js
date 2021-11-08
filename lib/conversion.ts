export interface InsightsSearchConversionEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: string[];
}

/**
 * Sends a conversion report in the context of search
 * @param params InsightsSearchConversionEvent
 */
export function convertedObjectIDsAfterSearch(
  params: InsightsSearchConversionEvent
) {
  this.sendEvent({ eventType: "conversion", ...params });
}

export interface InsightsSearchConversionObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}
/**
 * Sends a conversion report using objectIDs
 * @param params InsightsSearchConversionObjectIDsEvent
 */
export function convertedObjectIDs(
  params: InsightsSearchConversionObjectIDsEvent
) {
  this.sendEvent({ eventType: "conversion", ...params });
}

export interface InsightsSearchConversionFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}
/**
 * Sends a conversion report using filters, outside the context of a search
 * @param params InsightsSearchConversionFiltersEvent
 */
export function convertedFilters(params: InsightsSearchConversionFiltersEvent) {
  this.sendEvent({ eventType: "conversion", ...params });
}

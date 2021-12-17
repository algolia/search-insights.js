import { addEventType } from './_addEventType';
import type AlgoliaAnalytics from './insights';

export interface InsightsSearchConversionEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: string[];
}

export function convertedObjectIDsAfterSearch(
  this: AlgoliaAnalytics,
  ...params: InsightsSearchConversionEvent[]
) {
  return this.sendEvents(addEventType('conversion', params));
}

export interface InsightsSearchConversionObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}

export function convertedObjectIDs(
  this: AlgoliaAnalytics,
  ...params: InsightsSearchConversionObjectIDsEvent[]
) {
  return this.sendEvents(addEventType('conversion', params));
}

export interface InsightsSearchConversionFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

export function convertedFilters(
  this: AlgoliaAnalytics,
  ...params: InsightsSearchConversionFiltersEvent[]
) {
  return this.sendEvents(addEventType('conversion', params));
}

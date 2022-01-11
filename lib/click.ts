import { addEventType } from './_addEventType';
import type AlgoliaAnalytics from './insights';

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
  this: AlgoliaAnalytics,
  ...params: InsightsSearchClickEvent[]
) {
  return this.sendEvents(addEventType('click', params));
}

export interface InsightsClickObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}

export function clickedObjectIDs(
  this: AlgoliaAnalytics,
  ...params: InsightsClickObjectIDsEvent[]
) {
  return this.sendEvents(addEventType('click', params));
}

export interface InsightsClickFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

export function clickedFilters(
  this: AlgoliaAnalytics,
  ...params: InsightsClickFiltersEvent[]
) {
  return this.sendEvents(addEventType('click', params));
}

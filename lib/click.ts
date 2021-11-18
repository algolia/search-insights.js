import { InsightsEvent } from "./_sendEvent";

export interface InsightsClickEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;
  objectIDs: string[];
}

export function click({
  eventName,
  userToken,
  timestamp,
  index,
  objectIDs
}: InsightsClickEvent) {
  // https://codesandbox.io/s/cold-brook-is5k3?file=/src/index.js

  let lastResponse;
  try {
    lastResponse = JSON.parse(this._lastResponse.content);
  } catch (e) {
    // TODO: failed to parse
  }
  const indices = Array.isArray(lastResponse.results)
    ? lastResponse.results
    : [lastResponse];
  const indexObject = indices.find(indexObject => indexObject.index === index);
  // TODO: what it doesn't exist

  const queryID = indexObject.queryID;
  const objectIDPositionMap = indexObject.hits.reduce((acc, hit, index) => {
    acc[hit.objectID] = index;
  }, {});
  const positions = objectIDs
    .map(objectID => objectIDPositionMap[objectID])
    .map(position => indexObject.page * indexObject.hitsPerPage + position + 1);

  this.sendEvent({
    eventName,
    userToken,
    timestamp,
    index,
    objectIDs,
    queryID,
    positions
  });
}

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
  this.sendEvent("click", params as InsightsEvent);
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
  this.sendEvent("click", params as InsightsEvent);
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
  this.sendEvent("click", params as InsightsEvent);
}

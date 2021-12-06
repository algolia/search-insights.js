import { addEventType } from "./_addEventType";

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

  let lastResponse = this._lastResponse;
  const indices = Array.isArray(lastResponse.results)
    ? lastResponse.results
    : [lastResponse];
  const indexObject = indices.find(indexObject => indexObject.index === index);
  // TODO: what it doesn't exist

  const queryID = indexObject.queryID;
  const objectIDPositionMap = indexObject.hits.reduce((acc, hit, index) => {
    acc[hit.objectID] = index;
    return acc;
  }, {});
  const positions = objectIDs
    .map(objectID => objectIDPositionMap[objectID])
    .map(position => indexObject.page * indexObject.hitsPerPage + position + 1);

  this.sendEvent("click", {
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

import { addEventType } from "./_addEventType";
import { extractAdditionalParams, WithAdditionalParams } from "./utils";

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
  ...params: WithAdditionalParams<InsightsSearchClickEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchClickEvent>(params);

  return this.sendEvents(addEventType("click", events), additionalParams);
}

export interface InsightsClickObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}

export function clickedObjectIDs(
  ...params: WithAdditionalParams<InsightsClickObjectIDsEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsClickObjectIDsEvent>(params);

  return this.sendEvents(addEventType("click", events), additionalParams);
}

export interface InsightsClickFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

export function clickedFilters(
  ...params: WithAdditionalParams<InsightsClickFiltersEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsClickFiltersEvent>(params);

  return this.sendEvents(addEventType("click", events), additionalParams);
}

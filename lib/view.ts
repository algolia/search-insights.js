import { addEventType } from "./_addEventType";
import { extractAdditionalParams, WithAdditionalParams } from "./utils";

export interface InsightsSearchViewObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}

export function viewedObjectIDs(
  ...params: WithAdditionalParams<InsightsSearchViewObjectIDsEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchViewObjectIDsEvent>(params);

  return this.sendEvents(addEventType("view", events), additionalParams);
}

export interface InsightsSearchViewFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

export function viewedFilters(
  ...params: WithAdditionalParams<InsightsSearchViewFiltersEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchViewFiltersEvent>(params);

  return this.sendEvents(addEventType("view", events), additionalParams);
}

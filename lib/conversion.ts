import { addEventType, addEventTypeAndSubtype } from "./_addEventType";
import AlgoliaAnalytics from "./insights";
import { extractAdditionalParams, WithAdditionalParams } from "./utils";
import { InsightsEvent } from "./types";

export interface InsightsSearchConversionEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: string[];
  objectData?: InsightsEvent["objectData"];
}

export function convertedObjectIDsAfterSearch(
  this: AlgoliaAnalytics,
  ...params: WithAdditionalParams<InsightsSearchConversionEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchConversionEvent>(params);

  return this.sendEvents(addEventType("conversion", events), additionalParams);
}

export function addedToCartObjectIDsAfterSearch(
  this: AlgoliaAnalytics,
  ...params: WithAdditionalParams<InsightsSearchConversionEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchConversionEvent>(params);

  return this.sendEvents(
    addEventTypeAndSubtype("conversion", "addToCart", events),
    additionalParams
  );
}

export function purchasedObjectIDsAfterSearch(
  this: AlgoliaAnalytics,
  ...params: WithAdditionalParams<InsightsSearchConversionEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchConversionEvent>(params);

  return this.sendEvents(
    addEventTypeAndSubtype("conversion", "purchase", events),
    additionalParams
  );
}

export interface InsightsSearchConversionObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
  objectData?: InsightsEvent["objectData"];
}

export function convertedObjectIDs(
  this: AlgoliaAnalytics,
  ...params: WithAdditionalParams<InsightsSearchConversionObjectIDsEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchConversionObjectIDsEvent>(params);

  return this.sendEvents(addEventType("conversion", events), additionalParams);
}

export function addedToCartObjectIDs(
  this: AlgoliaAnalytics,
  ...params: WithAdditionalParams<InsightsSearchConversionObjectIDsEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchConversionObjectIDsEvent>(params);

  return this.sendEvents(
    addEventTypeAndSubtype("conversion", "addToCart", events),
    additionalParams
  );
}

export function purchasedObjectIDs(
  this: AlgoliaAnalytics,
  ...params: WithAdditionalParams<InsightsSearchConversionObjectIDsEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchConversionObjectIDsEvent>(params);

  return this.sendEvents(
    addEventTypeAndSubtype("conversion", "purchase", events),
    additionalParams
  );
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
  ...params: WithAdditionalParams<InsightsSearchConversionFiltersEvent>[]
) {
  const { events, additionalParams } =
    extractAdditionalParams<InsightsSearchConversionFiltersEvent>(params);

  return this.sendEvents(addEventType("conversion", events), additionalParams);
}

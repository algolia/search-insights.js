import { InsightsAdditionalEventParams } from "./types";
import { InsightsEvent } from "./_sendEvent";

export interface InsightsSearchConversionEvent {
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: (string | number)[];
}

/**
 * Sends a conversion report in the context of search
 * @param params InsightsSearchConversionEvent
 */
export function convertedObjectIDsAfterSearch(
  params: InsightsSearchConversionEvent,
  additionalParams?: InsightsAdditionalEventParams
) {
  if (!params) {
    throw new Error(
      "No params were sent to convertedObjectIDsAfterSearch function, please provide `queryID` and `objectIDs` to be reported"
    );
  }
  if (!params.queryID) {
    throw new Error(
      "required queryID parameter was not sent, conversion event can not be properly sent without"
    );
  }
  if (!params.objectIDs) {
    throw new Error(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  }

  this.sendEvent("conversion", params as InsightsEvent, additionalParams);
}

export interface InsightsSearchConversionObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: (string | number)[];
}
/**
 * Sends a conversion report using objectIDs
 * @param params InsightsSearchConversionObjectIDsEvent
 */
export function convertedObjectIDs(
  params: InsightsSearchConversionObjectIDsEvent,
  additionalParams?: InsightsAdditionalEventParams
) {
  if (!params) {
    throw new Error(
      "No params were sent to convertedObjectIDs function, please provide `objectIDs` to be reported"
    );
  }

  if (!params.objectIDs) {
    throw new Error(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  }

  this.sendEvent("conversion", params as InsightsEvent, additionalParams);
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
export function convertedFilters(
  params: InsightsSearchConversionFiltersEvent,
  additionalParams?: InsightsAdditionalEventParams
) {
  if (!params) {
    throw new Error(
      "No params were sent to convertedFilters function, please provide `filters` to be reported"
    );
  }
  if (!params.filters) {
    throw new Error(
      "required filters parameter was not sent, conversion event can not be properly sent without"
    );
  }

  this.sendEvent("conversion", params as InsightsEvent, additionalParams);
}

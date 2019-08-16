import { isNumber, isUndefined, isString } from "./utils";
import { RequestFnType } from "./utils/request";

export type InsightsEventType = "click" | "conversion" | "view";
export type InsightsEvent = {
  eventType: InsightsEventType;

  eventName?: string;
  userToken: string;
  timestamp?: number;
  index: string;

  queryID?: string;
  objectIDs?: (string | number)[];
  positions?: number[];

  filters?: string[];
};

export function makeSendEvent(requestFn: RequestFnType) {
  return function sendEvent(
    eventType: InsightsEventType,
    eventData: InsightsEvent
  ) {
    if (this._userHasOptedOut) {
      return;
    }
    if (!this._hasCredentials) {
      throw new Error(
        "Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters"
      );
    }
    if (!eventData.userToken && !this._userToken) {
      throw new Error(
        "Before calling any methods on the analytics, you first need to call 'setUserToken' function or include 'userToken' in the event payload."
      );
    }

    // mandatory params
    if (!isString(eventData.index)) {
      throw TypeError("expected required parameter `index` to be a string");
    }
    if (!isString(eventData.eventName)) {
      throw TypeError("expected required parameter `eventName` to be a string");
    }

    if (!isUndefined(eventData.userToken) && !isString(eventData.userToken)) {
      throw TypeError("expected optional parameter `userToken` to be a string");
    }

    const event: InsightsEvent = {
      eventType,
      eventName: eventData.eventName,
      userToken: eventData.userToken || this._userToken,
      index: eventData.index
    };

    // optional params
    if (!isUndefined(eventData.timestamp)) {
      if (!isNumber(eventData.timestamp)) {
        throw TypeError(
          "expected optional parameter `timestamp` to be a number"
        );
      }
      event.timestamp = eventData.timestamp;
    }

    if (!isUndefined(eventData.queryID)) {
      if (!isString(eventData.queryID)) {
        throw TypeError("expected optional parameter `queryID` to be a string");
      }
      event.queryID = eventData.queryID;
    }

    if (!isUndefined(eventData.objectIDs)) {
      if (!Array.isArray(eventData.objectIDs)) {
        throw TypeError(
          "expected optional parameter `objectIDs` to be an array"
        );
      }
      event.objectIDs = eventData.objectIDs;
    }

    if (!isUndefined(eventData.positions)) {
      if (!Array.isArray(eventData.positions)) {
        throw TypeError(
          "expected optional parameter `positions` to be an array"
        );
      }
      if (isUndefined(eventData.objectIDs)) {
        throw new Error("cannot use `positions` without providing `objectIDs`");
      }
      if (eventData.objectIDs.length !== eventData.positions.length) {
        throw new Error("objectIDs and positions need to be of the same size");
      }
      event.positions = eventData.positions;
    }

    if (!isUndefined(eventData.filters)) {
      if (!isUndefined(eventData.objectIDs)) {
        throw new Error(
          "cannot use `objectIDs` and `filters` for the same event"
        );
      }
      if (!Array.isArray(eventData.filters)) {
        throw TypeError("expected optional parameter `filters` to be an array");
      }
      event.filters = eventData.filters;
    }

    if (isUndefined(eventData.objectIDs) && isUndefined(eventData.filters)) {
      throw new Error(
        "expected either `objectIDs` or `filters` to be provided"
      );
    }

    bulkSendEvent(
      requestFn,
      this._appId,
      this._apiKey,
      this._uaURIEncoded,
      this._endpointOrigin,
      [event]
    );
  };
}

function bulkSendEvent(
  requestFn: RequestFnType,
  appId: string,
  apiKey: string,
  userAgent: string,
  endpointOrigin: string,
  events: InsightsEvent[]
) {
  // Auth query
  const reportingURL = `${endpointOrigin}/1/events?X-Algolia-Application-Id=${appId}&X-Algolia-API-Key=${apiKey}&X-Algolia-Agent=${userAgent}`;
  requestFn(reportingURL, { events });
}

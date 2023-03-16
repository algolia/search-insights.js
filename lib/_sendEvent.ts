import { InsightsAdditionalEventParams } from "./types";
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
    eventData: InsightsEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    if (this._userHasOptedOut) {
      return;
    }
    const hasCredentials =
      (!isUndefined(this._apiKey) && !isUndefined(this._appId)) ||
      (additionalParams?.headers["X-Algolia-Application-Id"] &&
        additionalParams?.headers["X-Algolia-API-Key"]);
    if (!hasCredentials) {
      throw new Error(
        "Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters or provide custom credentials in additional parameters."
      );
    }
    if (eventData.userToken === "" || this._userToken === "") {
      throw new Error("`userToken` cannot be an empty string.");
    }
    const userToken = eventData.userToken || this._userToken;
    if (isUndefined(userToken)) {
      throw new Error(
        "Before calling any methods on the analytics, you first need to call 'setUserToken' function or include 'userToken' in the event payload."
      );
    }

    // mandatory params
    if (!isString(eventData.index)) {
      throw new TypeError("expected required parameter `index` to be a string");
    }
    if (!isString(eventData.eventName)) {
      throw new TypeError(
        "expected required parameter `eventName` to be a string"
      );
    }

    if (!isUndefined(eventData.userToken) && !isString(eventData.userToken)) {
      throw new TypeError(
        "expected optional parameter `userToken` to be a string"
      );
    }

    const event: InsightsEvent = {
      eventType,
      eventName: eventData.eventName,
      userToken,
      index: eventData.index
    };

    // optional params
    if (!isUndefined(eventData.timestamp)) {
      if (!isNumber(eventData.timestamp)) {
        throw new TypeError(
          "expected optional parameter `timestamp` to be a number"
        );
      }
      event.timestamp = eventData.timestamp;
    }

    if (!isUndefined(eventData.queryID)) {
      if (!isString(eventData.queryID)) {
        throw new TypeError(
          "expected optional parameter `queryID` to be a string"
        );
      }
      event.queryID = eventData.queryID;
    }

    if (!isUndefined(eventData.objectIDs)) {
      if (!Array.isArray(eventData.objectIDs)) {
        throw new TypeError(
          "expected optional parameter `objectIDs` to be an array"
        );
      }
      event.objectIDs = eventData.objectIDs;
    }

    if (!isUndefined(eventData.positions)) {
      if (!Array.isArray(eventData.positions)) {
        throw new TypeError(
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
        throw new TypeError(
          "expected optional parameter `filters` to be an array"
        );
      }
      event.filters = eventData.filters;
    }

    if (isUndefined(eventData.objectIDs) && isUndefined(eventData.filters)) {
      throw new Error(
        "expected either `objectIDs` or `filters` to be provided"
      );
    }

    return bulkSendEvent(
      requestFn,
      this._appId,
      this._apiKey,
      this._uaURIEncoded,
      this._endpointOrigin,
      [event],
      additionalParams?.headers
    );
  };
}

function bulkSendEvent(
  requestFn: RequestFnType,
  appId: string,
  apiKey: string,
  userAgent: string,
  endpointOrigin: string,
  events: InsightsEvent[],
  additionalHeaders: InsightsAdditionalEventParams["headers"] = {}
) {
  // Auth query
  const headers = {
    "X-Algolia-Application-Id": appId,
    "X-Algolia-API-Key": apiKey,
    "X-Algolia-Agent": userAgent,
    ...additionalHeaders
  };

  const queryParameters = Object.keys(headers)
    .map((key) => `${key}=${headers[key]}`)
    .join("&");

  const reportingURL = `${endpointOrigin}/1/events?${queryParameters}`;
  return requestFn(reportingURL, { events });
}

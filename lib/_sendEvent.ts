import { isNumber, isUndefined, isString, isFunction } from "./utils/index";

export type InsightsEventType = "click" | "conversion";
export type InsightsEvent = {
  eventType: InsightsEventType;

  eventName: string;
  userToken: string;
  timestamp: number;
  index: string;

  queryID?: string;
  objectIDs?: (string | number)[];
  positions?: number[];
  
  filters?: string[];
};

/**
 *  Sends data to endpoint
 * @param eventType InsightsEventType
 * @param eventData InsightsSearchClickEvent|InsightsSearchConversionEvent
 */
export function sendEvent(
  eventType: InsightsEventType,
  eventData: InsightsEvent
) {
  if (this._userHasOptedOut) {
    return;
  }
  if (!this._hasCredentials) {
    throw new Error(
      "Before calling any methods on the analytics, you first need to call the 'init' function with applicationID and apiKey parameters"
    );
  }

  // mandatory params
  if (!isString(eventData.eventName)) {
    throw TypeError("expected required parameter `eventName` to be a string");
  }
  if (!isString(eventData.index)) {
    throw TypeError("expected required parameter `index` to be a string");
  }
  if (!isUndefined(eventData.timestamp) && !isNumber(eventData.timestamp)) {
    throw TypeError("expected optional parameter `timestamp` to be a number");
  }
  if (!isUndefined(eventData.userToken) && !isString(eventData.userToken)) {
    throw TypeError("expected optional parameter `userToken` to be a string");
  }

  const event: InsightsEvent = {
    eventType,
    eventName: eventData.eventName,
    userToken: eventData.userToken || this._userToken,
    timestamp: eventData.timestamp || Date.now(),
    index: eventData.index
  };

  // optional params
  if (!isUndefined(eventData.queryID)) {
    if (!isString(eventData.queryID)) {
      throw TypeError("expected optional parameter `queryID` to be a string");
    }
    event.queryID = eventData.queryID;
  }

  if (!isUndefined(eventData.objectIDs)) {
    if (!Array.isArray(eventData.objectIDs)) {
      throw TypeError("expected optional parameter `objectIDs` to be an array");
    }
    event.objectIDs = eventData.objectIDs;
  }

  if (!isUndefined(eventData.positions)) {
    if (!Array.isArray(eventData.positions)) {
      throw TypeError("expected optional parameter `positions` to be an array");
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
    throw new Error("expected either `objectIDs` or `filters` to be provided");
  }

  bulkSendEvent(this._applicationID, this._apiKey, this._endpointOrigin, [
    event
  ]);
}

function bulkSendEvent(
  applicationID: string,
  apiKey: string,
  endpointOrigin: string,
  events: InsightsEvent[]
) {
  // Auth query
  const reportingURL = `${endpointOrigin}/1/events?X-Algolia-Application-Id=${applicationID}&X-Algolia-API-Key=${apiKey}`;

  // Detect navigator support
  const supportsNavigator = navigator && isFunction(navigator.sendBeacon);

  const data = { events };

  // Always try sending data through sendbeacon
  if (supportsNavigator) {
    navigator.sendBeacon(reportingURL, JSON.stringify(data));
  } else {
    // Default to a synchronous XHR
    const report = new XMLHttpRequest();

    // Open connection
    report.open("POST", reportingURL);

    // Save queryID if event is search
    report.send(JSON.stringify(data));
  }
}

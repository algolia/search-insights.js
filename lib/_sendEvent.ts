import { isNumber, isUndefined, isString, isFunction } from "./utils/index";

declare var process: {
  env: {
    NODE_ENV: string;
  };
};

export type InsightsEventType = "click" | "conversion";
export type InsightsEvent = {
  eventType: InsightsEventType;

  eventName: string;
  userID: string;
  timestamp: number;
  index: string;

  queryID?: string;
  objectIDs?: (string | number)[];
  positions?: number[];
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
  // Add client timestamp and userID

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
  if (!isUndefined(eventData.userID) && !isString(eventData.userID)) {
    throw TypeError("expected optional parameter `userID` to be a string");
  }

  const event: InsightsEvent = {
    eventType,
    eventName: eventData.eventName,
    userID: eventData.userID || this._userID,
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
      throw new Error("Cannot use `positions` without providing `objectIDs`");
    }
    if (eventData.objectIDs.length !== eventData.positions.length) {
      throw new Error("objectIDs and positions need to be of the same size");
    }
    event.positions = eventData.positions;
  }

  bulkSendEvent(this._applicationID, this._apiKey, [event]);
}

function bulkSendEvent(
  applicationID: string,
  apiKey: string,
  events: InsightsEvent[]
) {
  const reportingQueryOrigin =
    process.env.NODE_ENV === "production"
      ? `https://insights.algolia.io/1/events`
      : `http://localhost:8080/1/events`;
  // Auth query
  const reportingURL = `${reportingQueryOrigin}?X-Algolia-Application-Id=${applicationID}&X-Algolia-API-Key=${apiKey}`;

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

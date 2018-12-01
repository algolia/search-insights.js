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
  timestamp: number; // TODO: we should allow Date object as well?
  indexName: string;

  queryID?: string;
  objectID?: (string | number) | (string | number)[];
  position?: number | number[];
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
  if (!isString(eventData.indexName)) {
    throw TypeError("expected required parameter `indexName` to be a string");
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
    indexName: eventData.indexName
  };

  // optional params
  if (isString(eventData.queryID)) {
    event.queryID = eventData.queryID;
  }
  if (!Array.isArray(eventData.objectID)) {
    event.objectID = [eventData.objectID];
  } else {
    event.objectID = eventData.objectID;
  }
  if (!Array.isArray(eventData.position)) {
    event.position = [eventData.position];
  } else {
    event.position = eventData.position;
  }

  if (event.objectID.length !== event.position.length) {
    throw new Error("objectID and position need to be of the same size");
  }
  // TODO: check eventType is matching eventData

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

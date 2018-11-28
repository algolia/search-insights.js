import { InsightsSearchClickEvent } from "./click";
import { InsightsSearchConversionEvent } from "./conversion";

declare var process: {
  env: {
    NODE_ENV: string;
  };
};

export type InsightsEventTypes = "click" | "conversion";
export type InsightsEvent = {
  eventType: InsightsEventTypes;

  eventName: string;
  userID: string;
  timestamp: number;
  indexName: string;

  query?: string;
  objectID?: (string | number)[];
  position?: (number)[];
};

/**
 *  Sends data to endpoint
 * @param eventType InsightsEventTypes
 * @param eventData InsightsSearchClickEvent|InsightsSearchConversionEvent
 */
export function sendEvent(
  eventType: InsightsEventTypes,
  eventData: InsightsSearchClickEvent | InsightsSearchConversionEvent
) {
  // Add client timestamp and userID
  const event: InsightsEvent = {
    eventType,
    eventName: eventData.eventName,
    userID: this._userID,
    timestamp: Date.now(),
    indexName: eventData.indexName
  };

  if (typeof eventData.queryID === "string") {
    event.queryID = eventData.queryID;
  }
  if (typeof eventData.objectID === "string") {
    event.objectID = [eventData.objectID];
  }
  if (typeof eventData.position === "number") {
    event.position = [eventData.position];
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
  const supportsNavigator =
    navigator && typeof navigator.sendBeacon === "function";

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

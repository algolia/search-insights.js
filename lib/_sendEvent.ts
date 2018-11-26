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
  eventData.timestamp = Date.now();
  eventData.userID = this._userID;
  eventData.eventType = eventType;
  // TODO: check eventType is matching eventData

  bulkSendEvent(this._applicationID, this.apiKey, [eventData]);
}

export function bulkSendEvent(
  applicationID: string,
  apiKey: string,
  events: InsightsEvent[]
) {

  // Origin
  const reportingQueryOrigin =
    process.env.NODE_ENV === "production"
      ? `https://insights.algolia.io/1/events`
      : `http://localhost:8080/1/events`;
  // Auth query
  const reportingURL =
    reportingQueryOrigin +
    `?X-Algolia-Application-Id=${applicationID}&X-Algolia-API-Key=${apiKey}`;

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

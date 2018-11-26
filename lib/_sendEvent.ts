import { InsightsSearchClickEvent } from './click';
import { InsightsSearchConversionEvent } from './conversion';

declare var process : {
  env: {
    NODE_ENV: string
  }
}

export type InsightsEvent = {
  userID: string;
  timestamp: number;
  indexName: string;
}

export type InsightsEventTypes = 'click'|'conversion'

/**
 *  Sends data to endpoint
 * @param eventType 'click'|'conversion'
 * @param eventData InsightsSearchConversionEvent|InsightsSearchClickEvent
 */
export function sendEvent(eventType: InsightsEventTypes, eventData: InsightsSearchClickEvent | InsightsSearchConversionEvent) {

  // Add client timestamp and userID
  eventData.timestamp = Date.now()
  eventData.userID = this._userID;

  // Origin
  const reportingQueryOrigin = process.env.NODE_ENV === 'production' ? `https://insights.algolia.io/1/searches/${eventType}` : `http://localhost:8080/1/${eventType}`;

  // Auth query
  const reportingURL = reportingQueryOrigin + `?X-Algolia-Application-Id=${this._applicationID}&X-Algolia-API-Key=${this._apiKey}`;

  // Detect navigator support
  const supportsNavigator = navigator && typeof navigator.sendBeacon === 'function';

  // Always try sending data through sendbeacon
  if(supportsNavigator){
    navigator.sendBeacon(reportingURL, JSON.stringify(eventData));

  } else {
    // Default to a synchronous XHR
    const report = new XMLHttpRequest()

    // Open connection
    report.open('POST', reportingURL)

    // Save queryID if event is search
    if(eventType === 'search'){
      report.onreadystatechange = () => {
        if (report.readyState === 4) {
          // If response has responseText
          if(report.responseText){
            // Parse JSON
            const response = report && report.responseText ? JSON.parse(report.responseText) : {};
            this._lastQueryID = response.queryID;
          }
        }
      }
    }

    report.send(JSON.stringify(eventData));
  }
}

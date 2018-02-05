import { ClickReport } from './click';
import { ConversionReport } from './conversion';
import { SearchReport } from './search';

declare var process : {
  env: {
    NODE_ENV: string
  }
}

export type AnalyticsEvent = {
  userID: string;
  timestamp: number;
  indexName: string;
}

export type ReportEvent = 'search'|'click'|'conversion'

/**
 *  Sends data to endpoint
 * @param eventType 'click'|'conversion'
 * @param eventData ConversionReport|ClickReport
 */
export function sendEvent(eventType: ReportEvent, eventData: ClickReport | ConversionReport | SearchReport) {

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
  if(supportsNavigator && eventType !== 'search'){
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
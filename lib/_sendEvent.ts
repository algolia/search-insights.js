import { RequestFnType } from "./utils/request";

export type InsightsEventType = "click" | "conversion" | "view";
export type InsightsEvent = {
  eventType: InsightsEventType;

  eventName: string;
  userToken: string;
  timestamp?: number;
  index: string;

  queryID?: string;
  objectIDs?: string[];
  positions?: number[];

  filters?: string[];
};

export function makeSendEvent(requestFn: RequestFnType) {
  return function sendEvent(
    ...eventData: InsightsEvent[]
  ) {
    if (this._userHasOptedOut) {
      return;
    }
    if (!this._hasCredentials) {
      throw new Error(
        "Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters"
      );
    }

    const events: InsightsEvent[] = eventData.map(data => ({
      ...data,
      userToken: data?.userToken ?? this._userToken
    }))

    return sendRequest(
      requestFn,
      this._appId,
      this._apiKey,
      this._uaURIEncoded,
      this._endpointOrigin,
      events
    );
  };
}

function sendRequest(
  requestFn: RequestFnType,
  appId: string,
  apiKey: string,
  userAgent: string,
  endpointOrigin: string,
  events: InsightsEvent[]
) {
  // Auth query
  const reportingURL = `${endpointOrigin}/1/events?X-Algolia-Application-Id=${appId}&X-Algolia-API-Key=${apiKey}&X-Algolia-Agent=${userAgent}`;
  return requestFn(reportingURL, { events });
}

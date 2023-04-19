import { RequestFnType } from "./utils/request";
import { InsightsAdditionalEventParams, InsightsEvent } from "./types";
import { isUndefined } from "./utils";

export function makeSendEvents(requestFn: RequestFnType) {
  return function sendEvents(
    eventData: InsightsEvent[],
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

    if (!this._userToken && this._anonymousUserToken) {
      this.setAnonymousUserToken(true);
    }

    const events: InsightsEvent[] = eventData.map((data) => {
      const { filters, ...rest } = data;

      const payload: InsightsEvent = {
        ...rest,
        userToken: data?.userToken ?? this._userToken
      };
      if (!isUndefined(filters)) {
        payload.filters = filters.map(encodeURIComponent);
      }
      return payload;
    });

    return sendRequest(
      requestFn,
      this._appId,
      this._apiKey,
      this._ua,
      this._endpointOrigin,
      events,
      additionalParams?.headers
    );
  };
}

function sendRequest(
  requestFn: RequestFnType,
  appId: string,
  apiKey: string,
  userAgents: string[],
  endpointOrigin: string,
  events: InsightsEvent[],
  additionalHeaders: InsightsAdditionalEventParams["headers"] = {}
) {
  // Auth query
  const headers = {
    "X-Algolia-Application-Id": appId,
    "X-Algolia-API-Key": apiKey,
    "X-Algolia-Agent": encodeURIComponent(userAgents.join("; ")),
    ...additionalHeaders
  };

  const queryParameters = Object.keys(headers)
    .map((key) => `${key}=${headers[key]}`)
    .join("&");

  const reportingURL = `${endpointOrigin}/1/events?${queryParameters}`;
  return requestFn(reportingURL, { events });
}

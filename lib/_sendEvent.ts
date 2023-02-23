import type { InsightsEvent } from './types';
import { isUndefined } from './utils';
import type { RequestFnType } from './utils/request';

export function makeSendEvents(requestFn: RequestFnType) {
  return function sendEvents(eventData: InsightsEvent[]) {
    if (this._userHasOptedOut) {
      return;
    }
    if (!this._hasCredentials) {
      throw new Error(
        "Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters"
      );
    }

    let _appId: string | undefined;
    let _apiKey: string | undefined;
    const events: InsightsEvent[] = eventData.map((data) => {
      const { filters, appId, apiKey, ...rest } = data;

      if (appId && apiKey) {
        _appId = appId;
        _apiKey = apiKey;
      }

      const payload: InsightsEvent = {
        ...rest,
        userToken: data?.userToken ?? this._userToken,
      };
      if (!isUndefined(filters)) {
        payload.filters = filters.map(encodeURIComponent);
      }
      return payload;
    });

    return sendRequest(
      requestFn,
      _appId || this._appId,
      _apiKey || this._apiKey,
      this._ua,
      this._endpointOrigin,
      events
    );
  };
}

// eslint-disable-next-line max-params
function sendRequest(
  requestFn: RequestFnType,
  appId: string,
  apiKey: string,
  userAgents: string[],
  endpointOrigin: string,
  events: InsightsEvent[]
) {
  // Auth query
  const ua = encodeURIComponent(userAgents.join('; '));
  const reportingURL = `${endpointOrigin}/1/events?X-Algolia-Application-Id=${appId}&X-Algolia-API-Key=${apiKey}&X-Algolia-Agent=${ua}`;
  return requestFn(reportingURL, { events });
}

import { SearchResponse, MultipleQueriesResponse } from '@algolia/client-search'

import { RequestFnType } from "./utils/request";
import { InsightsEvent } from './types'

export function makeSendEvents(requestFn: RequestFnType) {
  return function sendEvents(
    eventData: InsightsEvent[]
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
      ...infer.call(this, data),
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

function infer(data: Partial<InsightsEvent>) {
  const inferred: Partial<InsightsEvent> = {};

  if (!this._searchClientBinding || !data.index) {
    return {};
  }

  const lastResponse: SearchResponse | MultipleQueriesResponse<{}> = this._searchClientBinding.responses[this._searchClientBinding.responses.length - 1]
  const results: SearchResponse[] = isMultipleQueriesResponse(lastResponse) ? lastResponse.results : [lastResponse]
  const result = results.find(result => data.index === result.index);

  inferred.queryID = result.queryID;

  if (data.objectIDs) {
    const hitPositions = data.objectIDs.map(objectID => (result.hits || []).findIndex(hit => hit.objectID === objectID));
    inferred.positions = hitPositions.map(position => result.page * result.hitsPerPage + position + 1)
  }

  return inferred;
}

function isMultipleQueriesResponse<T = {}>(response): response is MultipleQueriesResponse<T> {
  return Array.isArray(response.results)
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

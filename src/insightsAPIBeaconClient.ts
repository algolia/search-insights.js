import { version } from '../package.json';

import { Beacon } from './beacon';

const HEADER = {
  APP_ID: 'X-Algolia-Application-Id',
  API_KEY: 'X-Algolia-API-Key',
};

export type InsightsAdditionalEventParams = {
  headers?: Record<string, string>;
};

export type InsightsApiEvent = {
  timestamp: ReturnType<typeof Date.now>;
  userToken?: string;

  eventType: 'click' | 'conversion' | 'view';
  eventName: string;

  index: string;

  queryID?: string;
  objectIDs?: string[];
  positions?: number[];
  filters?: string[];
};

export type InsightsRegion = 'de' | 'us';

type InsightsApiBeaconClientOptions = {
  appId?: string;
  apiKey?: string;
  region?: InsightsRegion;
  host?: string;
};

export class InsightsApiBeaconClient extends Beacon<
  InsightsApiEvent,
  InsightsAdditionalEventParams
> {
  appId?: string;
  apiKey?: string;
  region?: InsightsRegion;
  host?: string;

  private algoliaAgents = {
    [`search-insights.js (${version})`]: null,
  };

  constructor(opts: InsightsApiBeaconClientOptions = {}) {
    super();

    this.setOptions(opts);
  }

  setOptions(opts: InsightsApiBeaconClientOptions) {
    Object.keys(opts).forEach((opt) => {
      this[opt] = opts[opt];
    });
  }

  addAlgoliaAgent(agent: string) {
    this.algoliaAgents[agent] = null;
  }

  protected emit(
    event: InsightsApiEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    return fetch(`${this.endpoint()}/1/events`, {
      method: 'POST',
      headers: this.headers(additionalParams?.headers),
      body: JSON.stringify({ events: [event] }),
    }).then(({ ok }) => ok);
  }

  private endpoint() {
    if (this.host) {
      return this.host;
    }
    if (this.region) {
      return `https://insights.${this.region}.algolia.io`;
    }
    return 'https://insights.algolia.io';
  }

  private headers(
    additionalHeaders: InsightsAdditionalEventParams['headers'] = {}
  ) {
    const appId = additionalHeaders[HEADER.APP_ID] ?? this.appId;
    const apiKey = additionalHeaders[HEADER.API_KEY] ?? this.apiKey;

    if (!appId || !apiKey) {
      throw new Error(
        "Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters or provide custom credentials in additional parameters."
      );
    }

    return {
      [HEADER.APP_ID]: appId,
      [HEADER.API_KEY]: apiKey,
      'X-Algolia-Agent': Object.keys(this.algoliaAgents).join(' '),
      ...additionalHeaders,
    };
  }
}

import { version } from '../package.json';

import { Beacon } from './beacon';

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
  applicationId: string;
  apiKey: string;
  region?: InsightsRegion;
  host?: string;
};

export class InsightsApiBeaconClient extends Beacon<
  InsightsApiEvent,
  InsightsAdditionalEventParams
> {
  applicationId: string;
  apiKey: string;
  region?: InsightsRegion;
  host?: string;

  private algoliaAgents = {
    [`search-insights.js (${version})`]: null,
  };

  constructor(opts: InsightsApiBeaconClientOptions) {
    super();

    this.applicationId = opts.applicationId;
    this.apiKey = opts.apiKey;
    this.region = opts.region;
    this.host = opts.host;
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
    });
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
    return {
      'X-Algolia-Application-Id': this.applicationId,
      'X-Algolia-API-Key': this.apiKey,
      'X-Algolia-Agent': Object.keys(this.algoliaAgents).join(' '),
      ...additionalHeaders,
    };
  }
}

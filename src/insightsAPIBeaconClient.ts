import { Beacon } from './beacon';

export type InsightsAdditionalEventParams = {
  headers?: Record<string, string>;
};

export type InsightsApiEvent = {
  timestamp: ReturnType<typeof Date.now>;
  userToken: string;

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
};

export class InsightsApiBeaconClient extends Beacon<
  InsightsApiEvent,
  InsightsAdditionalEventParams
> {
  applicationId: string;
  apiKey: string;
  region?: InsightsRegion;

  private algoliaAgents = {
    [`search-insights.js (${process.env.__VERSION__ || process.env.NODE_ENV})`]:
      null,
  };

  constructor(opts: InsightsApiBeaconClientOptions) {
    super();

    this.applicationId = opts.applicationId;
    this.apiKey = opts.apiKey;
    this.region = opts.region;
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

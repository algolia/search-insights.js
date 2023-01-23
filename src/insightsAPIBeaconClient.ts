import { Beacon } from "./beacon";

export type InsightsApiEvent = {
  timestamp: ReturnType<typeof Date.now>;
  userToken: string;

  eventType: "view" | "click" | "conversion";
  eventName: string;

  index: string;

  queryID?: string;
  objectIDs?: string[];
  positions?: number[];
  filters?: string[];
};

type InsightsApiBeaconClientOptions = {
  applicationId: string;
  apiKey: string;
  region?: "us" | "de";
};

export class InsightsApiBeaconClient extends Beacon<InsightsApiEvent> {
  applicationId: string;
  apiKey: string;
  region?: "us" | "de";

  constructor(opts: InsightsApiBeaconClientOptions) {
    super();

    this.applicationId = opts.applicationId;
    this.apiKey = opts.apiKey;
    this.region = opts.region;
  }

  protected emit(event: InsightsApiEvent) {
    return fetch(`${this.endpoint()}/1/events`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ events: [event] })
    });
  }

  private endpoint() {
    if (this.region) {
      return `https://insights.${this.region}.algolia.io`;
    }
    return "https://insights.algolia.io";
  }

  private algoliaAgents = {
    [`search-insights.js (${process.env.__VERSION__ || process.env.NODE_ENV})`]:
      null
  };
  addAlgoliaAgent(agent: string) {
    this.algoliaAgents[agent] = null;
  }

  private headers() {
    return {
      "X-Algolia-Application-Id": this.applicationId,
      "X-Algolia-API-Key": this.apiKey,
      "X-Algolia-Agent": Object.keys(this.algoliaAgents).join(" ")
    };
  }
}

import { InsightsApiBeaconClient, InsightsApiEvent } from "./insightsAPIBeaconClient";

type BufferedMethodCall = [string, unknown];

type SnippetAlgoliaInsights = Array<BufferedMethodCall>;

type ObjectIDsAfterSearchEvent = {
  eventName: string;
  index: string;
  queryID: string;
  objectIDs: string[];
}

type ObjectIDsEvent = {
  eventName: string;
  index: string;
  objectIDs: string[];
}

type FiltersEvent = {
  eventName: string;
  index: string;
  filters: string[];
}

function flush(insights: SnippetAlgoliaInsights) {
  if (!Array.isArray(insights)) return [];
  const buffered = insights.splice(0, insights.length);
  return buffered.map(([methodName, ...args]) => ({ methodName, args }));
}

class AlgoliaInsights {
  initalized: boolean = false;
  [k: string]: any;

  private beacon?: InsightsApiBeaconClient;

  constructor(insights: SnippetAlgoliaInsights | AlgoliaInsights) {
    if ("initalized" in insights && insights.initalized) {
      return insights;
    }

    insights = insights as SnippetAlgoliaInsights;

    const flushedActions = flush(insights)
    if (flushedActions.length > 0 && flushedActions[0].methodName !== "init") {
        throw new Error("init must be called first")
    }

    const initAction = flushedActions.shift()
    this.init.apply(this, initAction?.args)
    this.initalized = true;

    flushedActions.forEach(({ methodName, args }) => {
      this[methodName].apply(this, args);
    });
  }

  public init({applicationId, apiKey, region}) {
    this.beacon = new InsightsApiBeaconClient({
        applicationId,
        apiKey,
        region,
    });

    // Flush and purge any existing events sitting in localStorage.
    this.beacon.flushAndPurgeEvents()
  }

  private userToken?: string;
  public setUserToken(userToken) {
    this.userToken = userToken;
  }

  public sendEvents(events: Array<Omit<InsightsApiEvent, "userToken" | "timestamp">>) {
    events.forEach(event => this.sendEvent(event))
  }

  private sendEvent(event: Omit<InsightsApiEvent, "userToken" | "timestamp">) {
    if (!this.beacon) {
        // TODO: log something saying you need to call init
        // or throw an error idk.
        return;
    }

    if (!this.userToken) {
        // TODO: log something saying you need to call init
        // or throw an error idk.
        return;
    }

    this.beacon.send({
        timestamp: Date.now(),
        userToken: this.userToken,

        ...event,
    })
  }
  
  public clickedObjectIDsAfterSearch(event: ObjectIDsAfterSearchEvent & { positions: number[] }) {
    this.sendEvent({
        eventType: "click",
        ...event,
    })
  }

  public clickedObjectIDs(event: ObjectIDsEvent) {
    this.sendEvent({
      eventType: "click",
      ...event,
    })
  }

  public clickedFilters(event: FiltersEvent) {
    this.sendEvent({
      eventType: "click",
      ...event,
    })
  }

  public convertedObjectIDsAfterSearch(event: ObjectIDsAfterSearchEvent) {
    this.sendEvent({
      eventType: "conversion",
      ...event
    });
  }

  public convertedObjectIDs(event: ObjectIDsEvent) {
    this.sendEvent({
      eventType: "conversion",
      ...event
    });
  }
  
  public convertedFilters(event: FiltersEvent) {
    this.sendEvent({
      eventType: "conversion",
      ...event
    });
  }
  
  public viewedObjectIDs(event: ObjectIDsEvent) {
    this.sendEvent({
      eventType: "view",
      ...event,
    })
  }
  
  public viewedFilters(event: FiltersEvent) {
    this.sendEvent({
      eventType: "view",
      ...event,
    })
  }
}

declare global {
  interface Window {
    insights: AlgoliaInsights;
  }
}

window.insights = new AlgoliaInsights(window.insights || []);

import { EventEmitter, EventEmitterCallback } from "./eventEmitter";
import {
  InsightsApiBeaconClient,
  InsightsApiEvent
} from "./insightsAPIBeaconClient";
import { UserToken, UserTokenOptions } from "./userToken";

type BufferedMethodCall = [string, unknown];

type SnippetAlgoliaInsights = BufferedMethodCall[];

type ObjectIDsAfterSearchEvent = {
  eventName: string;
  index: string;
  queryID: string;
  objectIDs: string[];
};

type ObjectIDsEvent = {
  eventName: string;
  index: string;
  objectIDs: string[];
};

type FiltersEvent = {
  eventName: string;
  index: string;
  filters: string[];
};

function flush(insights: SnippetAlgoliaInsights) {
  if (!Array.isArray(insights)) return [];
  const buffered = insights.splice(0, insights.length);
  return buffered.map(([methodName, ...args]) => ({ methodName, args }));
}

class AlgoliaInsights {
  initialized: boolean = false;
  [k: string]: any;

  private beacon?: InsightsApiBeaconClient;
  private emitter = new EventEmitter();

  constructor(i: SnippetAlgoliaInsights | AlgoliaInsights) {
    if ("initialized" in i && i.initialized) {
      return i;
    }

    const insights = i as SnippetAlgoliaInsights;

    const flushedActions = flush(insights);
    if (flushedActions.length > 0 && flushedActions[0].methodName !== "init") {
      throw new Error("init must be called first");
    }

    const initAction = flushedActions.shift();
    this.init.apply(this, initAction?.args);
    this.initialized = true;

    flushedActions.forEach(({ methodName, args }) => {
      this[methodName].apply(this, args);
    });
  }

  public init(
    opts: {
      applicationId: string;
      apiKey: string;
      region?: "us" | "de";
    } & UserTokenOptions
  ) {
    this.userToken = new UserToken({
      anonmyousId: opts.anonmyousId,
      userToken: opts.userToken
    });

    this.beacon = new InsightsApiBeaconClient({
      applicationId: opts.applicationId,
      apiKey: opts.apiKey,
      region: opts.region
    });

    // Flush and purge any existing events sitting in localStorage.
    this.beacon.flushAndPurgeEvents();
  }

  private userToken: UserToken;
  public setUserToken(userToken) {
    this.userToken.setUserToken(userToken);
    this.emitter.emit("userToken:changed", userToken);
  }

  public on(type: string, handler: EventEmitterCallback) {
    this.emitter.on(type, handler);
  }

  private addAlgoliaAgent(agent: string) {
    this.beacon?.addAlgoliaAgent(agent);
  }

  public sendEvents(
    events: Omit<InsightsApiEvent, "userToken" | "timestamp">[]
  ) {
    events.forEach((event) => this.sendEvent(event));
  }

  private sendEvent(event: Omit<InsightsApiEvent, "userToken" | "timestamp">) {
    if (!this.beacon || !this.userToken) {
      throw new Error(
        "Before calling any other method, you need to initialize the library by calling the 'init' function with appId and apiKey parameters"
      );
    }

    this.beacon.send({
      timestamp: Date.now(),
      userToken: this.userToken.getUserToken() ?? "",

      ...event
    });
  }

  public clickedObjectIDsAfterSearch(
    event: ObjectIDsAfterSearchEvent & { positions: number[] }
  ) {
    this.sendEvent({
      eventType: "click",
      ...event
    });
  }

  public clickedObjectIDs(event: ObjectIDsEvent) {
    this.sendEvent({
      eventType: "click",
      ...event
    });
  }

  public clickedFilters(event: FiltersEvent) {
    this.sendEvent({
      eventType: "click",
      ...event
    });
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
      ...event
    });
  }

  public viewedFilters(event: FiltersEvent) {
    this.sendEvent({
      eventType: "view",
      ...event
    });
  }
}

declare global {
  interface Window {
    insights: AlgoliaInsights;
  }
}

window.insights = new AlgoliaInsights(window.insights || []);

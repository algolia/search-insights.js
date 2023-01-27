import type { EventEmitterCallback } from './eventEmitter';
import { EventEmitter } from './eventEmitter';
import type {
  InsightsApiEvent,
  InsightsRegion,
} from './insightsAPIBeaconClient';
import { InsightsApiBeaconClient } from './insightsAPIBeaconClient';
import type { UserTokenOptions } from './userToken';
import { UserToken } from './userToken';

type BufferedMethodCall = [string, unknown, unknown, unknown?];

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

export class AlgoliaInsights {
  initialized: boolean = false;

  private beacon?: InsightsApiBeaconClient;
  private emitter = new EventEmitter();
  private userToken: UserToken;

  constructor(i: AlgoliaInsights | SnippetAlgoliaInsights) {
    if ('initialized' in i && i.initialized) {
      // eslint-disable-next-line no-constructor-return
      return i;
    }

    const insights = i as SnippetAlgoliaInsights;

    const flushedActions = flush(insights);
    if (flushedActions.length > 0 && flushedActions[0].methodName !== 'init') {
      throw new Error('init must be called first');
    }

    const initAction = flushedActions.shift();
    const initArgs = initAction?.args;
    if (!initArgs || initArgs.length < 2) {
      throw new Error(
        'Not enough arguments provided to the init call. Expected at least `applicationId` and `apiKey` to be provided.'
      );
    }

    this.init(initArgs[0] as string, initArgs[1] as string, initArgs[2] ?? {});
    this.initialized = true;

    flushedActions.forEach(({ methodName, args }) => {
      this[methodName](...args);
    });
  }

  init(
    applicationId: string,
    apiKey: string,
    opts?: UserTokenOptions & {
      region?: InsightsRegion;
    }
  ) {
    this.userToken = new UserToken({
      anonmyousId: opts?.anonmyousId,
      userToken: opts?.userToken,
    });

    this.beacon = new InsightsApiBeaconClient({
      applicationId,
      apiKey,
      region: opts?.region,
    });

    // Flush and purge any existing events sitting in localStorage.
    this.beacon.flushAndPurgeEvents();
  }

  addAlgoliaAgent(agent: string) {
    this.beacon?.addAlgoliaAgent(agent);
  }

  setUserToken(userToken: string) {
    this.userToken.setUserToken(userToken);
    this.emitter.emit('userToken:changed', userToken);
  }

  on(type: string, handler: EventEmitterCallback) {
    this.emitter.on(type, handler);
  }

  sendEvents(events: Array<Omit<InsightsApiEvent, 'timestamp' | 'userToken'>>) {
    events.forEach((event) => this.sendEvent(event));
  }

  clickedObjectIDsAfterSearch(
    event: ObjectIDsAfterSearchEvent & { positions: number[] }
  ) {
    this.sendEvent({
      eventType: 'click',
      ...event,
    });
  }

  clickedObjectIDs(event: ObjectIDsEvent) {
    this.sendEvent({
      eventType: 'click',
      ...event,
    });
  }

  clickedFilters(event: FiltersEvent) {
    this.sendEvent({
      eventType: 'click',
      ...event,
    });
  }

  convertedObjectIDsAfterSearch(event: ObjectIDsAfterSearchEvent) {
    this.sendEvent({
      eventType: 'conversion',
      ...event,
    });
  }

  convertedObjectIDs(event: ObjectIDsEvent) {
    this.sendEvent({
      eventType: 'conversion',
      ...event,
    });
  }

  convertedFilters(event: FiltersEvent) {
    this.sendEvent({
      eventType: 'conversion',
      ...event,
    });
  }

  viewedObjectIDs(event: ObjectIDsEvent) {
    this.sendEvent({
      eventType: 'view',
      ...event,
    });
  }

  viewedFilters(event: FiltersEvent) {
    this.sendEvent({
      eventType: 'view',
      ...event,
    });
  }

  private sendEvent(event: Omit<InsightsApiEvent, 'timestamp' | 'userToken'>) {
    if (!this.beacon || !this.userToken) {
      throw new Error(
        "Before calling any other method, you need to initialize the library by calling the 'init' function with applicationId and apiKey parameters"
      );
    }

    const userToken = this.userToken.getUserToken();
    if (!userToken) {
      // TODO(bhinchley): Introduce a debug mode, and only throw this error in debug mode.
      throw new Error('userToken required to send event');
    }

    this.beacon.send({
      userToken,
      timestamp: Date.now(),

      ...event,
    });
  }
}

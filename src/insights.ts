import type { AaQueue } from './aaShim';
import { AaShim } from './aaShim';
import type { EventEmitterCallback } from './eventEmitter';
import { EventEmitter } from './eventEmitter';
import type {
  InsightsAdditionalEventParams,
  InsightsApiEvent,
  InsightsRegion,
} from './insightsAPIBeaconClient';
import { InsightsApiBeaconClient } from './insightsAPIBeaconClient';
import type { Expand } from './types/utils';
import type { UserTokenOptions } from './userToken';
import { UserToken } from './userToken';

type BufferedMethodCall = [string, unknown, unknown?, unknown?];

type SnippetAlgoliaInsights = BufferedMethodCall[];

type InitOptions = {
  appId?: string;
  apiKey?: string;
  region?: InsightsRegion;
  host?: string;
};

type BaseEvent<T> = Expand<
  T & {
    eventName: string;
    index: string;
  }
>;

type ObjectIDsAfterSearchEvent = BaseEvent<{
  queryID: string;
  objectIDs: string[];
}>;

type ObjectIDsEvent = BaseEvent<{
  objectIDs: string[];
}>;

type FiltersEvent = BaseEvent<{
  filters: string[];
}>;

export class AlgoliaInsights {
  private beacon = new InsightsApiBeaconClient();
  private emitter = new EventEmitter();
  private userToken?: UserToken;

  constructor(i?: AlgoliaInsights | SnippetAlgoliaInsights, aa?: AaQueue) {
    if (i && !Array.isArray(i)) {
      // eslint-disable-next-line no-constructor-return
      return i;
    }

    if (aa && !aa.processed) {
      // eslint-disable-next-line no-new
      new AaShim(this, aa);
    }

    (i ?? []).forEach(([methodName, ...args]) => this[methodName](...args));
  }

  init(opts: InitOptions & UserTokenOptions = {}) {
    this.userToken = new UserToken({
      anonymousUserToken: opts?.anonymousUserToken,
      userToken: opts?.userToken,
    });

    this.beacon.setOptions(
      Object.keys(opts)
        .filter((opt) => ['appId', 'apiKey', 'region', 'host'].includes(opt))
        .reduce((acc, opt) => ({ ...acc, [opt]: opts[opt] }), {})
    );

    // Flush and purge any existing events sitting in localStorage.
    this.beacon.flushAndPurgeEvents();
  }

  addAlgoliaAgent(agent: string) {
    this.beacon?.addAlgoliaAgent(agent);
  }

  setUserToken(userToken?: string) {
    this.userToken?.setUserToken(userToken);
    this.emitter.emit('userToken:changed', this.getUserToken());
  }

  removeUserToken() {
    this.userToken?.removeUserToken();
    this.emitter.emit('userToken:changed', undefined);
  }

  getUserToken(callback?: (err: any, userToken: string) => void) {
    const userToken = this.userToken?.getUserToken();
    if (userToken && typeof callback === 'function') {
      callback(null, userToken);
    }
    return userToken;
  }

  on(type: string, handler: EventEmitterCallback) {
    this.emitter.on(type, handler);
  }

  sendEvents(
    events: Array<Omit<InsightsApiEvent, 'timestamp' | 'userToken'>>,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    events.forEach((event) => this.sendEvent(event, additionalParams));
  }

  clickedObjectIDsAfterSearch(
    event: ObjectIDsAfterSearchEvent & { positions: number[] },
    additionalParams?: InsightsAdditionalEventParams
  ) {
    this.sendEvent(
      {
        eventType: 'click',
        ...event,
      },
      additionalParams
    );
  }

  clickedObjectIDs(
    event: ObjectIDsEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    this.sendEvent(
      {
        eventType: 'click',
        ...event,
      },
      additionalParams
    );
  }

  clickedFilters(
    event: FiltersEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    this.sendEvent(
      {
        eventType: 'click',
        ...event,
      },
      additionalParams
    );
  }

  convertedObjectIDsAfterSearch(
    event: ObjectIDsAfterSearchEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    this.sendEvent(
      {
        eventType: 'conversion',
        ...event,
      },
      additionalParams
    );
  }

  convertedObjectIDs(
    event: ObjectIDsEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    this.sendEvent(
      {
        eventType: 'conversion',
        ...event,
      },
      additionalParams
    );
  }

  convertedFilters(
    event: FiltersEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    this.sendEvent(
      {
        eventType: 'conversion',
        ...event,
      },
      additionalParams
    );
  }

  viewedObjectIDs(
    event: ObjectIDsEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    this.sendEvent(
      {
        eventType: 'view',
        ...event,
      },
      additionalParams
    );
  }

  viewedFilters(
    event: FiltersEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) {
    this.sendEvent(
      {
        eventType: 'view',
        ...event,
      },
      additionalParams
    );
  }

  private sendEvent(
    event: Omit<InsightsApiEvent, 'timestamp' | 'userToken'>,
    additionalParams: InsightsAdditionalEventParams = {}
  ) {
    const userToken = this.userToken?.getUserToken();

    this.beacon.send(
      {
        userToken,
        timestamp: Date.now(),
        ...event,
      },
      additionalParams
    );
  }
}

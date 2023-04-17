import { version } from '../package.json';

import type { AlgoliaInsights } from './insights';
import { DefaultUserTokenOptions } from './userToken';

const MONTH = 30 * 24 * 60 * 60 * 1000;

export type AaQueue = {
  queue: Array<[string, any, any?]>;
  processed?: boolean;
};

type InsightRegion = 'de' | 'us';
interface InitParams {
  apiKey: string;
  appId: string;
  userHasOptedOut?: boolean;
  useCookie?: boolean;
  cookieDuration?: number;
  region?: InsightRegion;
  userToken?: string;
}

interface InsightsSearchClickEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  queryID: string;
  objectIDs: string[];
  positions: number[];
}
interface InsightsClickObjectIDsEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  objectIDs: string[];
}
interface InsightsClickFiltersEvent {
  eventName: string;
  userToken?: string;
  timestamp?: number;
  index: string;

  filters: string[];
}

type InsightsSearchConversionEvent = Omit<
  InsightsSearchClickEvent,
  'positions'
>;
type InsightsSearchConversionObjectIDsEvent = InsightsClickObjectIDsEvent;
type InsightsSearchConversionFiltersEvent = InsightsClickFiltersEvent;

type InsightsSearchViewObjectIDsEvent = InsightsClickObjectIDsEvent;
type InsightsSearchViewFiltersEvent = InsightsClickFiltersEvent;

export class AaShim {
  constructor(private insights: AlgoliaInsights, aa: AaQueue) {
    aa.queue.splice(0, aa.queue.length).forEach((args) => {
      const [methodName, ...methodArgs] = Array.from(args);
      this.processAaQueue(methodName, ...methodArgs);
    });

    const prevPush = aa.queue.push.bind(aa.queue);
    // eslint-disable-next-line no-param-reassign
    aa.queue.push = (args) => {
      const [methodName, ...methodArgs] = args;
      this.processAaQueue(methodName, ...methodArgs);
      return prevPush(args);
    };

    // eslint-disable-next-line no-param-reassign
    aa.processed = true;
  }

  init({
    appId,
    apiKey,
    region,
    userToken,
    cookieDuration,
    useCookie,
    userHasOptedOut,
  }: InitParams) {
    const defaultCookieDuration = 6 * MONTH;
    this.insights.init(appId, apiKey, {
      region,
      anonymousUserToken: {
        enabled:
          userHasOptedOut !== undefined
            ? !userHasOptedOut
            : DefaultUserTokenOptions.anonymousUserToken.enabled,
        lease: (cookieDuration ?? defaultCookieDuration) / 60 / 1000,
      },
      userToken: {
        cookie: useCookie ?? DefaultUserTokenOptions.userToken.cookie,
        lease: (cookieDuration ?? defaultCookieDuration) / 60 / 1000,
      },
    });
    if (userToken) {
      this.insights.setUserToken(userToken);
    }
  }

  addAlgoliaAgent(algoliaAgent: string) {
    this.insights.addAlgoliaAgent(algoliaAgent);
  }

  setUserToken(userToken: number | string) {
    this.insights.setUserToken(String(userToken));
  }

  getUserToken(
    options?: any,
    callback?: (err: any, userToken: string) => void
  ) {
    return this.insights.getUserToken(callback);
  }

  onUserTokenChange(
    callback?: (userToken: string) => void,
    options?: { immediate: boolean }
  ) {
    if (typeof callback === 'function') {
      this.insights.on('userToken:changed', callback);

      const userToken = this.insights.getUserToken();
      if (options?.immediate && userToken) {
        callback(userToken);
      }
    }
  }

  clickedObjectIDsAfterSearch(...params: InsightsSearchClickEvent[]) {
    params.forEach((p) => this.insights.clickedObjectIDsAfterSearch(p));
  }
  clickedObjectIDs(...params: InsightsClickObjectIDsEvent[]) {
    params.forEach((p) => this.insights.clickedObjectIDs(p));
  }
  clickedFilters(...params: InsightsClickFiltersEvent[]) {
    params.forEach((p) => this.insights.clickedFilters(p));
  }

  convertedObjectIDsAfterSearch(...params: InsightsSearchConversionEvent[]) {
    params.forEach((p) => this.insights.convertedObjectIDsAfterSearch(p));
  }
  convertedObjectIDs(...params: InsightsSearchConversionObjectIDsEvent[]) {
    params.forEach((p) => this.insights.convertedObjectIDs(p));
  }
  convertedFilters(...params: InsightsSearchConversionFiltersEvent[]) {
    params.forEach((p) => this.insights.convertedFilters(p));
  }

  viewedObjectIDs(...params: InsightsSearchViewObjectIDsEvent[]) {
    params.forEach((p) => this.insights.viewedObjectIDs(p));
  }
  viewedFilters(...params: InsightsSearchViewFiltersEvent[]) {
    params.forEach((p) => this.insights.viewedFilters(p));
  }

  getVersion(callback: (version: string) => void) {
    if (typeof callback === 'function') {
      callback(version);
    }
  }

  private processAaQueue(methodName: string, ...methodArgs: any[]) {
    if (!this[methodName]) {
      // eslint-disable-next-line no-console
      console?.warn(`${methodName} not implemented`);
      return;
    }
    this[methodName](...methodArgs);
  }
}

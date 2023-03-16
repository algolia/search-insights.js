import objectAssignPolyfill from "./polyfills/objectAssign";
import objectKeysPolyfill from "./polyfills/objectKeys";

objectKeysPolyfill();
objectAssignPolyfill();

import { makeSendEvent, InsightsEventType, InsightsEvent } from "./_sendEvent";

import { InitParams, init } from "./init";
import { get, GetCallback } from "./get";
import { initSearch, InitSearchParams } from "./_initSearch";
import { addAlgoliaAgent } from "./_algoliaAgent";
import { getVersion } from "./_getVersion";

import { RequestFnType } from "./utils/request";

import {
  InsightsSearchClickEvent,
  clickedObjectIDsAfterSearch,
  InsightsClickObjectIDsEvent,
  clickedObjectIDs,
  InsightsClickFiltersEvent,
  clickedFilters
} from "./click";
import {
  InsightsSearchConversionEvent,
  convertedObjectIDsAfterSearch,
  InsightsSearchConversionObjectIDsEvent,
  convertedObjectIDs,
  InsightsSearchConversionFiltersEvent,
  convertedFilters
} from "./conversion";
import {
  InsightsSearchViewObjectIDsEvent,
  viewedObjectIDs,
  InsightsSearchViewFiltersEvent,
  viewedFilters
} from "./view";
import {
  getUserToken,
  setUserToken,
  setAnonymousUserToken,
  onUserTokenChange,
  MONTH
} from "./_tokenUtils";
import { InsightsAdditionalEventParams } from "./types";
import { version } from "../package.json";

type Queue = {
  queue: string[][];
};

type AnalyticsFunction = {
  [key: string]: (fnName: string, fnArgs: any[]) => void;
};

export type AlgoliaAnalyticsObject = Queue | AnalyticsFunction;

declare global {
  interface Window {
    AlgoliaAnalyticsObject?: string;
  }
}

/**
 *  AlgoliaAnalytics class
 */
class AlgoliaAnalytics {
  _apiKey: string;
  _appId: string;
  _region: string;
  _endpointOrigin = "https://insights.algolia.io";
  _userToken: string;
  _userHasOptedOut = false;
  _useCookie = false;
  _cookieDuration = 6 * MONTH;

  // user agent
  _ua: string = "";
  _uaURIEncoded: string = "";

  version: string = version;

  protected sendEvent: (
    eventType: InsightsEventType,
    data: InsightsEvent
  ) => void;

  // Public methods
  public init: (params: InitParams) => void;
  public initSearch: (params: InitSearchParams) => void;

  public getVersion: (callback: (version: string) => void) => void;

  public addAlgoliaAgent: (algoliaAgent: string) => void;

  public setUserToken: (userToken: string) => void;
  public setAnonymousUserToken: () => void;
  public getUserToken: (
    options?: any,
    callback?: (err: any, userToken: string) => void
  ) => string;
  public onUserTokenChange: (
    callback: (userToken: string) => void,
    options: { immediate: boolean }
  ) => void;

  public clickedObjectIDsAfterSearch: (
    params: InsightsSearchClickEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) => void;
  public clickedObjectIDs: (
    params: InsightsClickObjectIDsEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) => void;
  public clickedFilters: (
    params: InsightsClickFiltersEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) => void;

  public convertedObjectIDsAfterSearch: (
    params: InsightsSearchConversionEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) => void;
  public convertedObjectIDs: (
    params: InsightsSearchConversionObjectIDsEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) => void;
  public convertedFilters: (
    params: InsightsSearchConversionFiltersEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) => void;

  public viewedObjectIDs: (
    params: InsightsSearchViewObjectIDsEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) => void;
  public viewedFilters: (
    params: InsightsSearchViewFiltersEvent,
    additionalParams?: InsightsAdditionalEventParams
  ) => void;

  public _get: (key: string, callback: GetCallback) => void;

  constructor({ requestFn }: { requestFn: RequestFnType }) {
    // Bind private methods to `this` class
    this.sendEvent = makeSendEvent(requestFn).bind(this);

    // Bind public methods to `this` class
    this.init = init.bind(this);
    this.initSearch = initSearch.bind(this);

    this.addAlgoliaAgent = addAlgoliaAgent.bind(this);

    this.setUserToken = setUserToken.bind(this);
    this.setAnonymousUserToken = setAnonymousUserToken.bind(this);
    this.getUserToken = getUserToken.bind(this);
    this.onUserTokenChange = onUserTokenChange.bind(this);

    this.clickedObjectIDsAfterSearch = clickedObjectIDsAfterSearch.bind(this);
    this.clickedObjectIDs = clickedObjectIDs.bind(this);
    this.clickedFilters = clickedFilters.bind(this);

    this.convertedObjectIDsAfterSearch =
      convertedObjectIDsAfterSearch.bind(this);
    this.convertedObjectIDs = convertedObjectIDs.bind(this);
    this.convertedFilters = convertedFilters.bind(this);

    this.viewedObjectIDs = viewedObjectIDs.bind(this);
    this.viewedFilters = viewedFilters.bind(this);

    this._get = get.bind(this);

    this.getVersion = getVersion.bind(this);
  }
}

export default AlgoliaAnalytics;

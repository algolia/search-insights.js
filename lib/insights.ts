import objectAssignPolyfill from "./polyfills/objectAssign";
import objectKeysPolyfill from "./polyfills/objectKeys";

objectKeysPolyfill();
objectAssignPolyfill();

import { processQueue } from "./_processQueue";
import { sendEvent, InsightsEventType, InsightsEvent } from "./_sendEvent";
import { StorageManager } from "./_storageManager";

import { InitParams, init } from "./init";
import { initSearch, InitSearchParams } from "./_initSearch";
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
  InsightsConversionObjectIDsEvent,
  convertedObjectIDs,
  InsightsConversionFiltersEvent,
  convertedFilters
} from "./conversion";
import {
  InsightsViewObjectIDsEvent,
  viewedObjectIDs,
  InsightsViewFiltersEvent,
  viewedFilters
} from "./view";
import { ANONYMOUS_USER_TOKEN, getUserToken, setUserToken } from "./_cookieUtils";

type Queue = {
  queue: string[][];
};

type AnalyticsFunction = {
  [key: string]: (fnName: string, fnArgs: any[]) => void;
};

type AlgoliaAnalyticsObject = Queue | AnalyticsFunction;

declare global {
  interface Window {
    AlgoliaAnalyticsObject: AlgoliaAnalyticsObject;
  }
}

/**
 *  AlgoliaAnalytics class
 */
class AlgoliaAnalytics {
  _apiKey: string;
  _appId: string;
  _region: string;
  _endpointOrigin: string;
  _userToken: string;
  _userHasOptedOut: boolean;
  _cookieDuration: number;

  // LocalStorage
  storageManager: StorageManager;

  // Private methods
  private processQueue: () => void;
  private sendEvent: (
    eventType: InsightsEventType,
    data: InsightsEvent
  ) => void;
  private _hasCredentials: boolean = false;

  // Public methods
  public init: (params: InitParams) => void;
  public initSearch: (params: InitSearchParams) => void;

  public ANONYMOUS_USER_TOKEN: string;
  public setUserToken: (userToken: string) => void;
  public getUserToken: () => string;

  public clickedObjectIDsAfterSearch: (
    params?: InsightsSearchClickEvent
  ) => void;
  public clickedObjectIDs: (params?: InsightsClickObjectIDsEvent) => void;
  public clickedFilters: (params?: InsightsClickFiltersEvent) => void;
  public convertedObjectIDsAfterSearch: (
    params?: InsightsSearchConversionEvent
  ) => void;
  public convertedObjectIDs: (
    params?: InsightsConversionObjectIDsEvent
  ) => void;
  public convertedFilters: (params?: InsightsConversionFiltersEvent) => void;

  public viewedObjectIDs: (params?: InsightsViewObjectIDsEvent) => void;
  public viewedFilters: (params?: InsightsViewFiltersEvent) => void;

  constructor(options?: any) {
    // Exit on old browsers or if script is not ran in browser
    if (!document.addEventListener || !window) {
      throw new Error(
        "Browser does not support eventlistener or there is no window object."
      );
    }

    // Init storage manager
    this.storageManager = new StorageManager();

    // Bind private methods to `this` class
    this.processQueue = processQueue.bind(this);
    this.sendEvent = sendEvent.bind(this);

    // Bind public methods to `this` class
    this.init = init.bind(this);
    this.initSearch = initSearch.bind(this);

    this.ANONYMOUS_USER_TOKEN = ANONYMOUS_USER_TOKEN;
    this.setUserToken = setUserToken.bind(this);
    this.getUserToken = getUserToken.bind(this);

    this.clickedObjectIDsAfterSearch = clickedObjectIDsAfterSearch.bind(this);
    this.clickedObjectIDs = clickedObjectIDs.bind(this);
    this.clickedFilters = clickedFilters.bind(this);

    this.convertedObjectIDsAfterSearch = convertedObjectIDsAfterSearch.bind(
      this
    );
    this.convertedObjectIDs = convertedObjectIDs.bind(this);
    this.convertedFilters = convertedFilters.bind(this);

    this.viewedObjectIDs = viewedObjectIDs.bind(this);
    this.viewedFilters = viewedFilters.bind(this);

    this.setUserToken(this.ANONYMOUS_USER_TOKEN);
    // Process queue upon script execution
    this.processQueue();
  }
}

const AlgoliaInsights = new AlgoliaAnalytics();

export default AlgoliaInsights;

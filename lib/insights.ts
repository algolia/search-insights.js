import objectAssignPolyfill from "./polyfills/objectAssign";
import objectKeysPolyfill from "./polyfills/objectKeys";

objectKeysPolyfill();
objectAssignPolyfill();

import { processQueue } from "./_processQueue";
import { sendEvent, InsightsEventType } from "./_sendEvent";
import { StorageManager } from "./_storageManager";
import { userID } from "./_cookieUtils";

import { InitParams, init } from "./init";
import { initSearch, InitSearchParams } from "./_initSearch";
import { InsightsSearchClickEvent, click } from "./click";
import { InsightsSearchConversionEvent, conversion } from "./conversion";

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
  _applicationID: string;
  _userID: string;

  // LocalStorage
  storageManager: StorageManager;

  // Private methods
  private processQueue: () => void;
  private sendEvent: (
    eventType: InsightsEventType,
    data: InsightsSearchClickEvent | InsightsSearchConversionEvent
  ) => void;
  private _hasCredentials: boolean = false;

  // Public methods
  public init: (params: InitParams) => void;
  public initSearch: (params: InitSearchParams) => void;
  public click: (params?: Partial<InsightsSearchClickEvent>) => void;
  public conversion: (params?: Partial<InsightsSearchConversionEvent>) => void;

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
    this.click = click.bind(this);
    this.conversion = conversion.bind(this);

    this._userID = userID();

    // Process queue upon script execution
    this.processQueue();
  }
}

const AlgoliaInsights = new AlgoliaAnalytics();

export default AlgoliaInsights;

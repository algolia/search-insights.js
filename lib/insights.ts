import objectAssignPolyfill from './polyfills/objectAssign.js';
import objectKeysPolyfill from './polyfills/objectKeys.js';

objectKeysPolyfill();
objectAssignPolyfill();

import { processQueue } from './_processQueue';
import { sendEvent, ReportEvent } from './_sendEvent';
import { StorageManager } from './_storageManager';
import { userID } from './_cookieUtils';

import { initParams, init } from './init';
import { initSearch, initSearchParams } from './_initSearch';
import { ClickReport, click } from './click';
import { ConversionReport, conversion } from './conversion';
import { SearchReport, search } from './search';

type Queue = {
  queue: string[][];
}

type AnalyticsFunction = {
  [key: string]: (fnName: string, fnArgs: any[]) => void;
}

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
  private sendEvent: (eventType: ReportEvent, data: ClickReport | ConversionReport) => void;
  private _hasCredentials: boolean = false;

  // Public methods
  public init: (params: initParams) => void;
  public initSearch: (params: initSearchParams) => void;
  public click: (params: ClickReport) => void;
  public conversion: (params: ConversionReport) => void;
  public search: (params: SearchReport) => void;

  constructor(options?: any) {
    // Exit on old browsers or if script is not ran in browser
    if(!document.addEventListener || !window){
      throw new Error('Browser does not support eventlistener or there is no window object.')
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
    this.search = search.bind(this);

    this._userID = userID();

    // Process queue upon script execution
    this.processQueue();
  }
}

const AlgoliaInsights = new AlgoliaAnalytics()

export default AlgoliaInsights
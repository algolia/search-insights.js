import { addAlgoliaAgent } from './_algoliaAgent';
import { getVersion } from './_getVersion';
import { makeSendEvents } from './_sendEvent';
import {
  getUserToken,
  setUserToken,
  setAnonymousUserToken,
  onUserTokenChange,
} from './_tokenUtils';
import { version } from './_version';
import {
  clickedObjectIDsAfterSearch,
  clickedObjectIDs,
  clickedFilters,
} from './click';
import {
  convertedObjectIDsAfterSearch,
  convertedObjectIDs,
  convertedFilters,
} from './conversion';
import { init } from './init';
import objectAssignPolyfill from './polyfills/objectAssign';
import objectKeysPolyfill from './polyfills/objectKeys';
import type { RequestFnType } from './utils/request';
import { viewedObjectIDs, viewedFilters } from './view';

objectKeysPolyfill();
objectAssignPolyfill();

type Queue = {
  queue: string[][];
};

type AnalyticsFunction = {
  [key: string]: (fnName: string, fnArgs: any[]) => void;
};

type AlgoliaAnalyticsObject = AnalyticsFunction | Queue;

declare global {
  interface Window {
    AlgoliaAnalyticsObject: AlgoliaAnalyticsObject;
  }
}

/**
 *  AlgoliaAnalytics class.
 */
class AlgoliaAnalytics {
  _apiKey?: string;
  _appId?: string;
  _region?: string;
  _endpointOrigin?: string;
  _userToken?: string;
  _userHasOptedOut?: boolean;
  _useCookie?: boolean;
  _cookieDuration?: number;
  _onUserTokenChangeCallback?: (userToken: string | undefined) => void;
  // user agent
  _ua: string[] = [];

  version: string = version;

  // Public methods
  init: typeof init;
  getVersion: typeof getVersion;
  addAlgoliaAgent: typeof addAlgoliaAgent;

  setUserToken: typeof setUserToken;
  setAnonymousUserToken: typeof setAnonymousUserToken;
  getUserToken: typeof getUserToken;
  onUserTokenChange: typeof onUserTokenChange;

  sendEvents: ReturnType<typeof makeSendEvents>;

  clickedObjectIDsAfterSearch: typeof clickedObjectIDsAfterSearch;
  clickedObjectIDs: typeof clickedObjectIDs;
  clickedFilters: typeof clickedFilters;

  convertedObjectIDsAfterSearch: typeof convertedObjectIDsAfterSearch;
  convertedObjectIDs: typeof convertedObjectIDs;
  convertedFilters: typeof convertedFilters;

  viewedObjectIDs: typeof viewedObjectIDs;
  viewedFilters: typeof viewedFilters;

  protected _hasCredentials: boolean = false;

  constructor({ requestFn }: { requestFn: RequestFnType }) {
    this.sendEvents = makeSendEvents(requestFn).bind(this);

    this.init = init.bind(this);

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

    this.getVersion = getVersion.bind(this);
  }
}

export default AlgoliaAnalytics;

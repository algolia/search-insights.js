const log = require('logToConsole');
const createArgumentsQueue = require('createArgumentsQueue');
const injectScript = require('injectScript');
const queryPermission = require('queryPermission');
const setInWindow = require('setInWindow');
const copyFromWindow = require('copyFromWindow');
const makeInteger = require('makeInteger');

const TEMPLATE_VERSION = '1.0.0';
const INSIGHTS_OBJECT_NAME = 'AlgoliaAnalyticsObject';
const aa = createArgumentsQueue('aa', 'aa.queue');

function isInitialized() {
  return !!copyFromWindow(INSIGHTS_OBJECT_NAME);
}

function formatValueToList(value) {
  // `20` is the limit that the engine processes.`
  return value && value.split(',').slice(0, 20);
}

function logger(message, event) {
  log('[GTM-DEBUG] Search Insights > ' + message, event || '');
}

switch (data.method) {
  case 'init': {
    if (isInitialized()) {
      logger('The "init" event has already been called.');
      break;
    }

    if (queryPermission('inject_script', data.searchInsightsSource)) {
      injectScript(
        data.searchInsightsSource,
        data.gtmOnSuccess,
        data.gtmOnFailure,
        data.searchInsightsSource
      );
    } else {
      logger(
        'The library endpoint is not allowed in the "Injects Scripts" permissions.\n\n' +
          'You need to add the value: "' +
          data.searchInsightsSource +
          '"\n\n' +
          'See https://www.simoahava.com/analytics/custom-templates-guide-for-google-tag-manager/#step-4-modify-permissions'
      );
      break;
    }

    setInWindow(INSIGHTS_OBJECT_NAME, 'aa');

    const userAgent = 'insights-gtm (' + TEMPLATE_VERSION + ')';
    logger('addAlgoliaAgent', userAgent);
    aa('addAlgoliaAgent', userAgent);

    const initOptions = {
      appId: data.appId,
      apiKey: data.apiKey,
      userHasOptedOut: data.userHasOptedOut,
      region: data.region,
      cookieDuration: data.cookieDuration,
    };

    logger(data.method, initOptions);
    aa(data.method, initOptions);

    if (data.initialUserToken) {
      logger('setUserToken', data.initialUserToken);
      aa('setUserToken', data.initialUserToken);
    }

    break;
  }

  case 'viewedObjectIDs': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      break;
    }

    const viewedObjectIDsOptions = {
      index: data.index,
      eventName: data.eventName,
      objectIDs: formatValueToList(data.objectIDs),
      userToken: data.userToken,
    };

    logger(data.method, viewedObjectIDsOptions);
    aa(data.method, viewedObjectIDsOptions);

    break;
  }

  case 'clickedObjectIDsAfterSearch': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      break;
    }

    const clickedObjectIDsAfterSearchOptions = {
      index: data.index,
      objectIDs: formatValueToList(data.objectIDs),
      positions: formatValueToList(data.positions).map(makeInteger),
      queryID: data.queryID,
      userToken: data.userToken,
    };

    logger(data.method, clickedObjectIDsAfterSearchOptions);
    aa(data.method, clickedObjectIDsAfterSearchOptions);

    break;
  }

  case 'clickedObjectIDs': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      break;
    }

    const clickedObjectIDsOptions = {
      index: data.index,
      eventName: data.eventName,
      queryID: data.queryID,
      objectIDs: formatValueToList(data.objectIDs),
      userToken: data.userToken,
    };

    logger(data.method, clickedObjectIDsOptions);
    aa(data.method, clickedObjectIDsOptions);

    break;
  }

  case 'clickedFilters': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      break;
    }

    const clickedFiltersOptions = {
      eventName: data.eventName,
      filters: formatValueToList(data.filters),
      index: data.index,
      userToken: data.userToken,
    };

    logger(data.method, clickedFiltersOptions);
    aa(data.method, clickedFiltersOptions);

    break;
  }

  case 'convertedObjectIDsAfterSearch': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      break;
    }

    const convertedObjectIDsAfterSearchOptions = {
      index: data.index,
      objectIDs: formatValueToList(data.objectIDs),
      queryID: data.queryID,
      userToken: data.userToken,
    };

    logger(data.method, convertedObjectIDsAfterSearchOptions);
    aa(data.method, convertedObjectIDsAfterSearchOptions);

    break;
  }

  case 'convertedObjectIDs': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      break;
    }

    const convertedObjectIDsOptions = {
      eventName: data.eventName,
      index: data.index,
      objectIDs: formatValueToList(data.objectIDs),
      userToken: data.userToken,
    };

    logger(data.method, convertedObjectIDsOptions);
    aa(data.method, convertedObjectIDsOptions);

    break;
  }

  case 'convertedFilters': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      break;
    }

    const convertedFiltersOptions = {
      eventName: data.eventName,
      filters: formatValueToList(data.filters),
      index: data.index,
      userToken: data.userToken,
    };

    logger(data.method, convertedFiltersOptions);
    aa(data.method, convertedFiltersOptions);

    break;
  }

  case 'viewedFilters': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      break;
    }

    const viewedFiltersOptions = {
      eventName: data.eventName,
      filters: formatValueToList(data.filters),
      index: data.index,
      userToken: data.userToken,
    };

    logger(data.method, viewedFiltersOptions);
    aa(data.method, viewedFiltersOptions);

    break;
  }

  default: {
    logger('You need to set the method for this event.');
  }
}

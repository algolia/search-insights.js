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

switch (data.eventType) {
  case 'init': {
    if (isInitialized()) {
      logger('The "init" event has already been called.');
      break;
    }

    setInWindow(INSIGHTS_OBJECT_NAME, 'aa');

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

    aa('addAlgoliaAgent', 'insights-gtm (' + TEMPLATE_VERSION + ')');

    const initOptions = {
      appId: data.appId,
      apiKey: data.apiKey,
      userHasOptedOut: data.userHasOptedOut,
      region: data.region,
      cookieDuration: data.cookieDuration,
    };

    logger(data.eventType, initOptions);

    aa('init', initOptions);

    if (data.setUserToken) {
      aa('setUserToken', data.setUserToken);
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

    aa(data.eventType, viewedObjectIDsOptions);

    logger(data.eventType, viewedObjectIDsOptions);

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

    aa(data.eventType, clickedObjectIDsAfterSearchOptions);

    logger(data.eventType, clickedObjectIDsAfterSearchOptions);

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
    };

    aa(data.eventType, clickedObjectIDsOptions);

    logger(data.eventType, clickedObjectIDsOptions);

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

    aa(data.eventType, clickedFiltersOptions);

    logger(data.eventType, clickedFiltersOptions);

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

    aa(data.eventType, convertedObjectIDsAfterSearchOptions);

    logger(data.eventType, convertedObjectIDsAfterSearchOptions);

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

    aa(data.eventType, convertedObjectIDsOptions);

    logger(data.eventType, convertedObjectIDsOptions);

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

    aa(data.eventType, convertedFiltersOptions);

    logger(data.eventType, convertedFiltersOptions);

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

    aa(data.eventType, viewedFiltersOptions);

    logger(data.eventType, viewedFiltersOptions);

    break;
  }

  default: {
    logger('Unknown event');
  }
}

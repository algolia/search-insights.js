# Search Insights

[![Build Status](https://circleci.com/gh/algolia/search-insights.js.svg?style=shield)](https://github.com/algolia/search-insights.js)
[![npm version](https://badge.fury.io/js/search-insights.svg)](https://badge.fury.io/js/search-insights)

Search Insights lets you report click, conversion and view metrics using the [Algolia Insights API](https://www.algolia.com/doc/rest-api/insights/#overview).

## Table of Contents

<!-- toc -->

- [Getting started](#getting-started)
  - [Browser](#browser)
  - [Node.js](#nodejs)
- [Use cases](#use-cases)
  - [Search (Click Analytics and A/B testing)](#search-click-analytics-and-ab-testing)
  - [Personalization](#personalization)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

<!-- tocstop -->

## Cookie usage

You're looking at the documentation of `search-insights` v2, which is the new major version. (_Click [here](https://github.com/algolia/search-insights.js/blob/v1/README.md) for v1.x documentation._)

v2 introduces a breaking change which is `useCookie` being `false` by default. If it's `false`, `search-insights` doesn't generate anonymous userToken. It means no event will be sent until `setUserToken` is explicitly called.

## Payload validation

Since v2.0.4, search-insights no longer validates event payloads.
You can visit https://algolia.com/events/debugger instead.

## Getting started

>
> Are you using Google Tag Manager in your app? We provide a [custom template](https://github.com/algolia/search-insights-gtm) to ease the integration.

### Browser


insights-js-docs: https://www.algolia.com/doc/api-client/methods/insights/#install-the-insights-client
instant-search-guide: https://www.algolia.com/doc/guides/building-search-ui/events/js/
autocomplete-guide: https://www.algolia.com/doc/ui-libraries/autocomplete/guides/sending-algolia-insights-events/






## Use cases

The Search Insights library supports both [Search](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/out-of-the-box-analytics/) and [Personalization](https://www.algolia.com/doc/guides/getting-insights-and-analytics/personalization/personalization/) Algolia features.

### Search (Click Analytics and A/B testing)

#### Initialize

To enable click analytics, the search parameter [`clickAnalytics`](https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/) must be set to `true`. This tells the Algolia engine to return a `queryID` on each search request.

```js
const searchClient = algoliasearch('APPLICATION_ID', 'SEARCH_API_KEY');
const search = instantsearch({
  indexName: 'INDEX_NAME',
  searchClient,
  searchParameters: {
    clickAnalytics: true,
  },
});

function getQueryID() {
  return search.helper.lastResults.queryID;
}
```

#### Report a click event

```js
aa('clickedObjectIDsAfterSearch', {
  index: 'INDEX_NAME',
  eventName: 'Click item',
  queryID: getQueryID(),
  objectIDs: ['object1'],
  positions: [42],
});
```

| Option      | Type       | Description                                                                                         |
| ----------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `index`     | `string`   | The name of the index related to the event                                                          |
| `eventName` | `string`   | The name of the event                                                                               |
| `objectIDs` | `string[]` | The list of IDs of the result that was clicked                                                      |
| `positions` | `number[]` | The list of the absolute positions of the HTML element that was clicked (1-based and _not_ 0-based) |
| `queryID`   | `string`   | The `queryID` of the search sent from Algolia                                                       |

#### Report a conversion event

```js
aa('convertedObjectIDsAfterSearch', {
  index: 'INDEX_NAME',
  eventName: 'Add to basket',
  queryID: getQueryID(),
  objectIDs: ['object1'],
});
```

| Option      | Type       | Description                                    |
| ----------- | ---------- | ---------------------------------------------- |
| `index`     | `string`   | The name of the index related to the event     |
| `eventName` | `string`   | The name of the event                          |
| `objectIDs` | `string[]` | The list of IDs of the result that was clicked |
| `queryID`   | `string`   | The `queryID` of the search sent from Algolia  |

### Personalization

#### Initialize

To enable personalization, the search parameter [`enablePersonalization`](https://www.algolia.com/doc/api-reference/api-parameters/enablePersonalization/) must be set to `true`.

```js
const searchClient = algoliasearch('APPLICATION_ID', 'SEARCH_API_KEY');
const search = instantsearch({
  indexName: 'INDEX_NAME',
  searchClient,
  searchParameters: {
    enablePersonalization: true,
  },
});
```

#### Access `userToken`

In cases where the `userToken` is generated, you need a way to access the `userToken` so that you can pass it to the `searchClient`.

```js
const searchClient = algoliasearch('APPLICATION_ID', 'SEARCH_API_KEY');

aa('getUserToken', null, (err, userToken) => {
  // for algoliasearch v3.x
  searchClient.setExtraHeader('X-Algolia-UserToken', userToken);

  // for algoliasearch v4.x
  searchClient.transporter.headers['X-Algolia-UserToken'] = userToken;
});
```

#### Listen to `userToken` change

If you want to attach a listener for `userToken` change, you can call `onUserTokenChange`.

```js
aa('onUserTokenChange', (userToken) => {
  console.log("userToken has changed: ", userToken);
});
```

`onUserTokenChange` accepts `callback`(required) and `options`(optional).

```js
aa('onUserTokenChange', callback, options);
```

| Option      | Type       | Description                                    |
| ----------- | ---------- | ---------------------------------------------- |
| `immediate` | `boolean`  | Fire the callback as soon as it's attached     |

```js
aa('init', { ..., useCookie: true });  // ← This sets an anonymous user token if cookie is available.

aa('onUserTokenChange', (userToken) => {
  console.log(userToken);  // prints out the anonymous user token
}, { immediate: true });
```

```js
aa('init', { ... });
aa('setUserToken', 'my-user-id-1');

aa('onUserTokenChange', (userToken) => {
  console.log(userToken); // prints out 'my-user-id-1'
}, { immediate: true })
```

With `immediate: true`, `onUserTokenChange` will be immediately fired with the token which is set beforehand.

#### Report a click event

```js
aa('clickedObjectIDs', {
  index: 'INDEX_NAME',
  eventName: 'Add to basket',
  objectIDs: ['object1'],
});
```

| Option      | Type       | Description                                    |
| ----------- | ---------- | ---------------------------------------------- |
| `index`     | `string`   | The name of the index related to the event     |
| `eventName` | `string`   | The name of the event                          |
| `objectIDs` | `string[]` | The list of IDs of the result that was clicked |

```js
aa('clickedFilters', {
  index: 'INDEX_NAME',
  eventName: 'Filter on facet',
  filters: ['brand:Apple'],
});
```

| Option      | Type       | Description                                                      |
| ----------- | ---------- | ---------------------------------------------------------------- |
| `index`     | `string`   | The name of the index related to the event                       |
| `eventName` | `string`   | The name of the event                                            |
| `filters`   | `string[]` | The list of filters that was clicked as `'${attr}${op}${value}'` |

#### Report a conversion event

```js
aa('convertedObjectIDs', {
  index: 'INDEX_NAME',
  eventName: 'Add to basket',
  objectIDs: ['object1'],
});
```

| Option      | Type       | Description                                    |
| ----------- | ---------- | ---------------------------------------------- |
| `index`     | `string`   | The name of the index related to the event     |
| `eventName` | `string`   | The name of the event                          |
| `objectIDs` | `string[]` | The list of IDs of the result that was clicked |

```js
aa('convertedFilters', {
  index: 'INDEX_NAME',
  eventName: 'Filter on facet',
  filters: ['brand:Apple'],
});
```

| Option      | Type       | Description                                                      |
| ----------- | ---------- | ---------------------------------------------------------------- |
| `index`     | `string`   | The name of the index related to the event                       |
| `eventName` | `string`   | The name of the event                                            |
| `filters`   | `string[]` | The list of filters that was clicked as `'${attr}${op}${value}'` |

#### Report a view event

```js
aa('viewedObjectIDs', {
  index: 'INDEX_NAME',
  eventName: 'Add to basket',
  objectIDs: ['object1'],
});
```

| Option      | Type       | Description                                    |
| ----------- | ---------- | ---------------------------------------------- |
| `index`     | `string`   | The name of the index related to the event     |
| `eventName` | `string`   | The name of the event                          |
| `objectIDs` | `string[]` | The list of IDs of the result that was clicked |

```js
aa('viewedFilters', {
  index: 'INDEX_NAME',
  eventName: 'Filter on facet',
  filters: ['brand:Apple'],
});
```

| Option      | Type       | Description                                                      |
| ----------- | ---------- | ---------------------------------------------------------------- |
| `index`     | `string`   | The name of the index related to the event                       |
| `eventName` | `string`   | The name of the event                                            |
| `filters`   | `string[]` | The list of filters that was clicked as `'${attr}${op}${value}'` |

### Batch Events

You can send multiple events in a single HTTP request, by using `sendEvents` method.

```js
aa('sendEvents', [
  {
    eventType,
    eventName,
    userToken,
    ...
  }
]);
```

| Option      | Type                            | Description                                    |
| ----------- | ------------------------------- | ---------------------------------------------- |
| `eventType` | `'view'` \| `'click'` \| `'conversion'` | The name of the index related to the event.    |
| `eventName` | `string`                        | The name of the event.                         |
| `userToken` | `string` (optional)             | search-insights uses anonymous user token or a token set by `setUserToken` method. You can override it by providing a `userToken` per event object. |

### Sending events to multiple Algolia applications

The Search Insights library sends all events to the Algolia application it has been initialized with, by default. In some cases, you might have data coming from more than one Algolia application which all need events.

You can use a single instance of the Search Insights library while still customizing the Algolia credentials on a per-event basis. All click, view and conversion methods support an additional argument where you can specify credentials that will override those set during initialization (which is optional).

```js
aa('clickedObjectIDsAfterSearch', {
  index: 'INDEX_NAME',
  eventName: 'Click item',
  queryID: getQueryID(),
  objectIDs: ['object1'],
  positions: [42],
}, {
  headers: {
    'X-Algolia-Application-Id': 'OTHER_APP_ID',
    'X-Algolia-API-Key': 'OTHER_SEARCH_API_KEY'
  }
});
```

This also works with event batching, using `sendEvents`:

```js
aa('sendEvents', [
  {
    eventType,
    eventName,
    userToken,
    ...
  }
], {
  headers: {
    'X-Algolia-Application-Id': 'OTHER_APP_ID',
    'X-Algolia-API-Key': 'OTHER_SEARCH_API_KEY'
  }
});
```

| Option    | Type                     | Description                                                  |
| --------- | ------------------------ | ------------------------------------------------------------ |
| `headers` | `Record<string, string>` | A dictionary of headers that will override those set by default. You can check out a list of headers for authentication in the [Algolia API reference](https://www.algolia.com/doc/rest-api/insights/#authentication). |


## Contributing

To run the examples and the code, you need to run two separate commands:

- `yarn dev` runs webpack and the Node.js server
- `yarn build:dev` runs Rollup in watch mode

To release, go on `main` (`git checkout main`) and use:

```sh
yarn run release
```

It will create a pull request for the next release. When it's reviewed, approved and merged, then CircleCI will automatically publish it to npm.

## License

Search Insights is [MIT licensed](LICENSE.md).

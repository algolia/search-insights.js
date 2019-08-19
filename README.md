# Search Insights

[![Build Status](https://travis-ci.org/algolia/search-insights.js.svg?branch=master)](https://travis-ci.org/algolia/search-insights.js)
[![npm version](https://badge.fury.io/js/search-insights.svg)](https://badge.fury.io/js/search-insights)

Search Insights lets you report click, conversion and view metrics using the [Algolia Insights API](https://www.algolia.com/doc/rest-api/insights/#overview).

## Table of Contents

<!-- toc -->

- [Getting started](#getting-started)
  - [On Browser](#on-browser)
  - [On Node.js](#on-nodejs)
- [Use cases](#use-cases)
  - [Search (Click Analytics and A/B testing)](#search-click-analytics-and-ab-testing)
  - [Personalization](#personalization)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

<!-- tocstop -->

## Getting started

### On Browser

#### 1. Load the library

The Search Insights library can be either loaded via [jsDelivr CDN](https://www.jsdelivr.com/) or directly bundled with your application.
We recommend loading the library by adding the snippet below to all pages where you wish to track search analytics.

<!-- prettier-ignore-start -->
```html
<script>
  !function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){(e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)[0],i.async=1,i.src="https://cdn.jsdelivr.net/npm/search-insights@1.2.2",c.parentNode.insertBefore(i,c)}(window,document,"script",0,"aa");
</script>
```
<!-- prettier-ignore-end -->

#### 2. Initialize the library

```js
aa('init', {
  appId: 'APP_ID',
  apiKey: 'SEARCH_API_KEY',
});

// Optional: set the analytics user ID
aa('setUserToken', 'USER_ID');
```

| Option            | Type           | Default                  | Description                                    |
| ----------------- | -------------- | ------------------------ | ---------------------------------------------- |
| **`appId`**       | `string`       | None (required)          | The identifier of your Algolia application     |
| **`apiKey`**      | `string`       | None (required)          | The search API key of your Algolia application |
| `userHasOptedOut` | `boolean`      | `false`                  | Whether to exclude users from analytics        |
| `region`          | `'de' \| 'us'` | Automatic                | The DNS server to target                       |
| `cookieDuration`  | `number`       | `15552000000` (6 months) | The cookie duration in milliseconds            |

### On Node.js

#### 1. Install the library

Insights library can be used on the backend as a Node.js module. _(Node.js `>= 8.16.0` required)_

```bash
$ npm install search-insights
or
$ yarn add search-insights
```

#### 2. Initialize the library

```js
const aa = require("search-insights");
aa("init", {
  appId: "APPLICATION_ID",
  apiKey: "SEARCH_API_KEY"
});
```
It exports the same `aa` interface.

#### Add `userToken`

On the Node.js environment, unlike the browser environment, `userToken` must be specified when sending any event.

```js
aa("clickedObjectIDs", {
  userToken: "id-of-user",
  // ...
});
```

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
| `positions` | `string[]` | The list of the absolute positions of the HTML element that was clicked (1-based and _not_ 0-based) |
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

```ts
const searchClient = algoliasearch('APPLICATION_ID', 'SEARCH_API_KEY');

aa('getUserToken', null, (err, userToken) => {
  searchClient.setExtraHeader('X-Algolia-UserToken', userToken);
});
```

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

## Examples

The following examples assume that the Search Insights library is loaded.

- [InstantSearch.js](https://github.com/algolia/search-insights.js/blob/master/examples/INSTANTSEARCH.md)
- [AlgoliaSearch Helper](https://github.com/algolia/search-insights.js/blob/master/examples/HELPER.md)
- [React Instantsearch](https://github.com/algolia/search-insights.js/blob/master/examples/react-instantsearch/src/App.js)

## Contributing

To run the examples and the code, you need to run two separate commands:

- `yarn dev` runs webpack and the Node.js server
- `yarn build:dev` runs Rollup in watch mode

## License

Search Insights is [MIT licensed](license.md).
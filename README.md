# Insights

<!-- [START badges] -->

[![Build Status](https://travis-ci.org/algolia/search-insights.js.svg?branch=master)](https://travis-ci.org/algolia/search-insights.js)
[![npm version](https://badge.fury.io/js/search-insights.svg)](https://badge.fury.io/js/search-insights)

<!-- [END badges] -->

Library for detecting front-end search metrics

## Concept

Algolia insights client allows developers to report click, conversion and view metrics related using the [Insights REST API](https://www.algolia.com/doc/rest-api/insights/#overview)

## Getting started

### <a name="loading"></a>Loading and initializing the library

Insights library can be either loaded via jsDelivr CDN or directly bundled with your application.
We recommend loading the library by adding the snippet below to all pages where you wish to track
search analytics.

```html
<script>
  !function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){(e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)[0],i.async=1,i.src="https://cdn.jsdelivr.net/npm/search-insights@1.0.0",c.parentNode.insertBefore(i,c)}(window,document,"script",0,"aa");

  // Initialize library
  aa('init', {
    applicationID: 'APPLICATION_ID',
    apiKey: 'SEARCH_API_KEY',
    userHasOptedOut?: boolean; // default: false
    region?: "de" | "us"; // default auto
    cookieDuration?: 10 * 24 * 60 * 60 * 1000; // in milliseconds. default: 15552000000ms (6 months)
  })
</script>
```

### Enabling queryID response from Algolia engine

In order for the Algolia engine to return a queryID on each search request, a special query parameter `clickAnalytics=true` should be set.

InstantSearch

```js
const search = instantsearch({
  appId: "APPLICATION_ID",
  apiKey: "SEARCH_API_KEY",
  indexName: "INDEX_NAME",
  searchParameters: {
    clickAnalytics: true,
    enablePersonalization: true
  }
});
```

algoliasearch-helper:

```js
const helper = algoliasearchHelper(client, "INDEX_NAME", {
  clickAnalytics: true,
  enablePersonalization: true
});
```

## In the context of search (Click Analytics & A/B testing)

```js
const search = instantsearch({
  appId: "APPLICATION_ID",
  apiKey: "SEARCH_API_KEY",
  indexName: "INDEX_NAME",
  searchParameters: {
    clickAnalytics: true
  }
});
function getQueryID() {
  return search.helper.lastResults.queryID;
}
```

### Reporting a click event

```js
aa('clickedObjectIDsAfterSearch', {
    index: 'INDEX_NAME'
    queryID: getQueryID(),
    objectIDs: [ 'object1' ],
    positions: [ 42 ]
});
```

- **index**: name of the index searched. \*required
- **objectID**: it is the ID of the result that has been clicked. \*required
- **position**: absolute position of the clicked element inside the DOM. (The value is 1 based and not 0 based!) \*required
- **queryID**: queryID of the related search \*required

### Reporting a conversion event

```js
aa('convertedObjectIDsAfterSearch', {
    index: 'INDEX_NAME'
    queryID: getQueryID(),
    objectIDs: [ 'object1' ]
});
```

- **index**: name of the index searched. \*required
- **objectID**: it is the ID of the result that has been clicked. \*required
- **queryID**: queryID of the related search \*required

## In the context of Personalization:

```js
const search = instantsearch({
  appId: "APPLICATION_ID",
  apiKey: "SEARCH_API_KEY",
  indexName: "INDEX_NAME",
  searchParameters: {
    clickAnalytics: true
  }
});
function getQueryID() {
  return search.helper.lastResults.queryID;
}
```

### Reporting a click event

```js
aa('clickedObjectIDs', {
    index: 'INDEX_NAME'
    eventName: "Add to basket',
    objectIDs: [ 'object1' ]
});
```
- **index**: name of the index searched. \*required
- **eventName**: name of the event. \*required
- **objectID**: it is the ID of the result that has been clicked. \*required

```js
aa('clickedFilters', {
    index: 'INDEX_NAME'
    eventName: "Filter on facet',
    filters: [ 'brand:Apple' ]
});
```

- **index**: name of the index searched. \*required
- **eventName**: name of the event. \*required
- **filters**: it is the facet that has been clicked. \*required

### Reporting a conversion event

```js
aa('convertedObjectIDs', {
    index: 'INDEX_NAME'
    eventName: "Add to basket',
    objectIDs: [ 'object1' ]
});
aa('convertedFilters', {
    index: 'INDEX_NAME'
    eventName: "Filter on facet',
    filters: [ 'brand:Apple' ]
});
```

### Reporting a view event

```js
aa('viewedObjectIDs', {
    index: 'INDEX_NAME'
    eventName: "Add to basket',
    objectIDs: [ 'object1' ]
});
aa('viewedFilters', {
    index: 'INDEX_NAME'
    eventName: "Filter on facet',
    filters: [ 'brand:Apple' ]
});
```

### Library implementation examples

All library examples are done with an assumption, that you have already completed the first step of loading the library.

- [InstantSearch.js example](https://github.com/algolia/search-insights.js/blob/master/examples/INSTANTSEARCH.md)
- [algoliasearch-helper example](https://github.com/algolia/search-insights.js/blob/master/examples/HELPER.md)
- [Vue-instantsearch example](https://github.com/algolia/search-insights.js/blob/master/examples/vue-instantsearch/src/App.vue)
- [React-instantsearch example](https://github.com/algolia/search-insights.js/blob/master/examples/react-instantsearch/src/App.js)
- [Autocomplete example](https://github.com/algolia/search-insights.js/blob/master/examples/autocomplete/autocomplete.js)

#### Running examples locally

To run all examples and play around with the code you have to run two separate commands:

- `yarn dev` - runs webpack and node dev server
- `yarn build:dev` - runs rollup in watch mode - livereload if you do changes to the insights library

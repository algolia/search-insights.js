# Migrations

## Migrating from v0 to v1

### `init` signature has changed

- `applicationID` is now called `appId` to be consistent with our [other JavaScript libraries](https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/js/?language=javascript#previous-usage).

#### Before

```js
aa('init', {
  applicationID: 'APPLICATION_ID',
  apiKey: 'SEARCH_API_KEY',
  // ...
});
```

#### After

```js
aa('init', {
  appId: 'APPLICATION_ID',
  apiKey: 'SEARCH_API_KEY',
  // ...
});
```

### `initSearch` method has been removed

This method was previously used to pass the `getQueryID` helper. Now, you need to explicitly call this helper
and pass the result to methods that require it (namely `clickedObjectIDsAfterSearch` and `convertedObjectIDsAfterSearch`)

#### Before

```js
aa('initSearch', {
  getQueryID: () => search.helper.lastResults.queryID,
});
```

#### After

```js
function getQueryID() {
  return search.helper.lastResults.queryID;
}
```

### `click` and `convert` methods have changed

They've been renamed to make it clear that they are intended to be called in the context of a search.

- `click` is now `clickedObjectIDsAfterSearch`
- `convert` is now `convertedObjectIDsAfterSearch`

Their signatures have changed to reflect the different use cases covered by the Search Insights client.

- `clickedObjectIDsAfterSearch`

  - `eventName: string` is now required
  - `index: string` is now required
  - `objectID: number | string` is now `objectIDs: Array<number | string>`
  - `queryID: string` is now required – use the `getQueryID` helper
  - `position: number` is now `positions: Array<number>`

- `convertedObjectIDsAfterSearch`
  - `eventName: string` is now required
  - `index: string` is now required
  - `objectID: number | string` is now `objectIDs: Array<number | string>`
  - `queryID: string` is now required – use the `getQueryID` helper

#### Before

```js
aa('click', {
  objectID: 'object1',
  position: 42,
});

aa('convert', {
  objectID: 'object1',
  position: 42,
});
```

#### After

```js
aa('clickedObjectIDsAfterSearch', {
  index: 'INDEX_NAME',
  eventName: 'Click item',
  queryID: getQueryID(),
  objectIDs: ['object1'],
  positions: [42],
});

aa('convertedObjectIDsAfterSearch', {
  index: 'INDEX_NAME',
  eventName: 'Click item',
  queryID: getQueryID(),
  objectIDs: ['object1'],
});
```

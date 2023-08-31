# Node.js

Node.js `>= 16.0.0` required

## 1. Install the library

Insights library can be used on the backend as a Node.js module.

```bash
npm install search-insights
# or
yarn add search-insights
```

## 2. Initialize the library

Initializing the library is optional, as you can specify the [credentials for each event](https://www.algolia.com/doc/api-reference/api-methods/send-events/#method-param-additionalparams) when sending them.
This gives you the flexibility to manage your Algolia credentials on a per-event basis, without having to configure them upfront.

```js
const aa = require('search-insights');

// Optional: configure default Algolia credentials for events
aa('init', {
  appId: 'APPLICATION_ID',
  apiKey: 'SEARCH_API_KEY',
});
```

## 3. Add `userToken`

On the Node.js environment, unlike the browser environment, `userToken` must be specified when sending any event.

```js
aa('clickedObjectIDs', {
  userToken: 'USER_ID',
  // ...
});
```

## (Optional) Customize the client

If you want to customize the way to send events, you can create a custom Insights client.

```js
// via ESM
import { createInsightsClient } from 'search-insights';
// OR in commonJS
const { createInsightsClient } = require('search-insights');
// OR via the UMD
const createInsightsClient = window.AlgoliaAnalytics.createInsightsClient;

function requestFn(url, data) {
  const serializedData = JSON.stringify(data);
  const { protocol, host, path } = require('url').parse(url);
  const options = {
    protocol,
    host,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': serializedData.length,
    },
  };

  const { request: nodeRequest } =
    url.indexOf('https://') === 0 ? require('https') : require('http');
  const req = nodeRequest(options);

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(serializedData);
  req.end();
}

const aa = createInsightsClient(requestFn);
```

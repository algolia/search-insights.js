# Search Insights for Google Tag Manager (GTM)

Google Tag Manager [custom template](https://developers.google.com/tag-manager/templates/) for Algolia Search Insights.

---

<div align="center">

<a href="generated/search-insights.tpl" download>

**Download template**

</a>

</div>

---

## Setup

### 1. Import the template

- Download <a href="generated/search-insights.tpl" download><strong><code>search-insights.tpl</code></strong></a>
- Import the file in [Google Tag Manager](https://tagmanager.google.com)
  - Go to "Templates"
  - Click on "New"
  - Select "Import" in the menu

You can close the overlay.

### 2. Create variables

For events to be sent with the correct information (`userToken`, `objectIDs`, `queryID`, etc.), you need to add variables in the "User-Defined Variables" section.

1. Click "New" in the Variables panel
1. Refer to the "[Variables](#variables)" section.

### 3. Create triggers

1. Click "New" in the Triggers panel
1. Select the element to interact with

### 4. Create tags

1. Click "New" in the Tags panel
1. Select the tag type "Algolia Search Insights"
1. Choose the Insights method and provide the options
1. Refer to the "[Tags](#tags)" section

## Tags

### Clicked Object IDs After Search

This method refers to the [Clicked Object IDs After Search](https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids-after-search/) Insights API.

#### Required variables

- `eventName`
- [`userToken`](#userToken)
- `index`
- [`queryID`](#queryID)
- [`objectIDs`](#objectIDs)
- [`positions`](#positions)

#### Required template

##### InstantSearch.js

```js
instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: `
<article
 data-insights-object-id="{{objectID}}"
 data-insights-position="{{__position}}"
 data-insights-query-id="{{__queryID}}"
>
  <!-- ... -->
</article>
`,
  },
});
```

### Clicked Object IDs

This method refers to the [Clicked Object IDs](https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids/) Insights API.

#### Required variables

- `eventName`
- [`userToken`](#userToken)
- `index`
- [`objectIDs`](#objectIDs)
- [`positions`](#positions)

#### Required template

##### InstantSearch.js

```js
instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: `
<article
 data-insights-object-id="{{objectID}}"
 data-insights-position="{{__position}}"
>
  <!-- ... -->
</article>
`,
  },
});
```

### Clicked Filters

This method refers to the [Clicked Filters](https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids/) Insights API.

#### Required variables

- `eventName`
- [`userToken`](#userToken)
- `index`
- [`filters`](#filters)

#### Required template

Replace `brand` by the attribute to track.

##### InstantSearch.js

```js
instantsearch.widgets.refinementList({
  container: '#brands',
  attribute: 'brand',
  templates: {
    item: `
<label
  class="ais-RefinementList-label"
  data-insights-filter="brand:{{value}}"
>
  <input type="checkbox" class="ais-RefinementList-checkbox" value="{{value}}">
  <span class="ais-RefinementList-labelText">{{label}}</span>
  <span class="ais-RefinementList-count">{{count}}</span>
</label>
`,
  },
});
```

### Converted Objects IDs After Search

This method refers to the [Converted Objects IDs After Search](https://www.algolia.com/doc/api-reference/api-methods/converted-object-ids-after-search/) Insights API.

#### Required variables

- `eventName`
- [`userToken`](#userToken)
- `index`
- [`queryID`](#queryID)
- [`objectIDs`](#objectIDs)

#### Required template

##### InstantSearch.js

```js
instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: `
<article
 data-insights-object-id="{{objectID}}"
 data-insights-position="{{__position}}"
 data-insights-query-id="{{__queryID}}"
>
  <!-- ... -->
</article>
`,
  },
});
```

### Converted Objects IDs

This method refers to the [Converted Objects IDs](https://www.algolia.com/doc/api-reference/api-methods/converted-object-ids/) Insights API.

#### Required variables

- `eventName`
- [`userToken`](#userToken)
- `index`
- [`objectIDs`](#objectIDs)

#### Required template

##### InstantSearch.js

```js
instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: `
<article data-insights-object-id="{{objectID}}">
  <!-- ... -->
</article>
`,
  },
});
```

### Converted Filters

This method refers to the [Converted Filters](https://www.algolia.com/doc/api-reference/api-methods/converted-filters/) Insights API.

#### Required variables

- `eventName`
- [`userToken`](#userToken)
- `index`
- [`filters`](#filters)

#### Required template

##### InstantSearch.js

Replace `brand` by the attribute to track.

```js
instantsearch.widgets.refinementList({
  container: '#brands',
  attribute: 'brand',
  templates: {
    item: `
<label
  class="ais-RefinementList-label"
  data-insights-filter="brand:{{value}}"
>
  <input type="checkbox" class="ais-RefinementList-checkbox" value="{{value}}">
  <span class="ais-RefinementList-labelText">{{label}}</span>
  <span class="ais-RefinementList-count">{{count}}</span>
</label>
`,
  },
});
```

### Viewed Object IDs

This method refers to the [Viewed Object IDs](https://www.algolia.com/doc/api-reference/api-methods/viewed-object-ids/) Insights API.

#### Required variables

- `eventName`
- [`userToken`](#userToken)
- `index`
- [`objectIDs`](#objectIDs)

#### Required template

##### InstantSearch.js

```js
instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: `
<article data-insights-object-id="{{objectID}}">
  <!-- ... -->
</article>
`,
  },
});
```

### Viewed Filters

This method refers to the [Viewed Filters](https://www.algolia.com/doc/api-reference/api-methods/viewed-filters/) Insights API.

#### Required variables

- `eventName`
- [`userToken`](#userToken)
- `index`
- [`filters`](#filters)

#### Required template

Replace `brand` by the attribute to track.

##### InstantSearch.js

```js
instantsearch.widgets.refinementList({
  container: '#brands',
  attribute: 'brand',
  templates: {
    item: `
<label
  class="ais-RefinementList-label"
  data-insights-filter="brand:{{value}}"
>
  <input type="checkbox" class="ais-RefinementList-checkbox" value="{{value}}">
  <span class="ais-RefinementList-labelText">{{label}}</span>
  <span class="ais-RefinementList-count">{{count}}</span>
</label>
`,
  },
});
```

## Variables

### `userToken`

The user token can be forwarded to GTM via a [Data Layer](https://developers.google.com/tag-manager/devguide#datalayer).

In you application code, store the `userToken` in the Data Layer:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  userToken: 'USER_1',
});
```

In GTM, create a variable called `UserToken` of type "Data Layer Variable" with the name `userToken` (same name as the JavaScript key pushed to the Data Layer).

In the GTM interface, a new variable called `{{UserToken}}` is available.

### `objectIDs`, `positions`, `queryID`

The `objectIDs`, `positions`, `queryID` variables can be forwarded to GTM via [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

The following example uses InstantSearch.js and assumes the data attributes are set in the templates.

```js
const search = instantsearch({
  searchClient,
  indexName: 'products',
});

search.addWidgets([
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
<article
 data-insights-object-id="{{objectID}}"
 data-insights-position="{{__position}}"
 data-insights-query-id="{{__queryID}}"
>
  <!-- ... -->
</article>
`,
    },
  }),
]);

search.start();
```

> `__queryID` and `__position` are available from:
>
> - InstantSearch.js 3.4.0
> - React InstantSearch 5.5.0
> - Vue InstantSearch 2.1.0
> - Angular InstantSearch 3.0.0

Once these values are available in the hits template, you can retrieve them in GTM.

First, you need to create a utility variable to target elements based on their selector. Select "Custom JavaScript" variable and name it `Find closest`:

```js
function() {
  return function(target, selector) {
    while (!target.matches(selector) && !target.matches('body')) {
      target = target.parentElement;
    }

    return target.matches(selector) ? target : undefined;
  }
}
```

In the GTM interface, a new variable called `{{Find closest}}` is available and contains the nearest element matching the selector.

#### `objectID`

Create a "Custom JavaScript" variable and name it `HitObjectID`:

```js
function() {
  var element = {{Find closest}}({{Click Element}}, '[data-insights-object-id]');

  return typeof element !== 'undefined'
    ? element.getAttribute('data-insights-object-id')
    : undefined;
}
```

In the GTM interface, a new variable called `{{HitObjectID}}` is available and gives you the object ID of the hit.

> We use [`getAttribute`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute) to add compatibility for IE which doesn't support [JavaScript access to `dataset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset).

#### `positions`

Create a "Custom JavaScript" variable and name it `HitPosition`:

```js
function() {
  var element = {{Find closest}}({{Click Element}}, '[data-insights-position]');

  return typeof element !== 'undefined'
    ? element.getAttribute('data-insights-position')
    : undefined;
}
```

In the GTM interface, a new variable called `{{HitPosition}}` is available and gives you the absolute position of the hit ([see API reference](https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids-after-search/#method-param-positions)).

#### `queryID`

##### From InstantSearch

Create a "Custom JavaScript" variable and name it `HitQueryID`:

```js
function() {
  var element = {{Find closest}}({{Click Element}}, '[data-insights-query-id]');

  return typeof element !== 'undefined'
    ? element.getAttribute('data-insights-query-id')
    : undefined;
}
```

In the GTM interface, a new variable called `{{HitQueryID}}` is available and gives you the query ID related to the hit. This is the identifier of the search query that returned the hit (see [API reference](https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids-after-search/#method-param-queryid)).

##### From the URL

Create a "URL" variable of type "Query" and name it `URLQueryID`.

In the GTM interface, a new variable called `{{URLQueryID}}` is available and gives you the query ID related to the URL.

### `filters`

The `filters` variable can be forwarded to GTM via [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

The following example uses InstantSearch.js and assumes the data attributes are set in the templates.

```js
const search = instantsearch({
  searchClient,
  indexName: 'products',
});

search.addWidgets([
  instantsearch.widgets.refinementList({
    container: '#brands',
    attribute: 'brand',
    templates: {
      item: `
<label
  class="ais-RefinementList-label"
  data-insights-filter="brand:{{value}}"
>
  <input type="checkbox" class="ais-RefinementList-checkbox" value="{{value}}">
  <span class="ais-RefinementList-labelText">{{label}}</span>
  <span class="ais-RefinementList-count">{{count}}</span>
</label>
`,
    },
  }),
]);

search.start();
```

Once these values are available in the hits template, you can retrieve them in GTM.

Create a "Custom JavaScript" variable and name it `Filters`:

```js
function() {
  var element = {{Find closest}}({{Click Element}}, '[data-insights-filter]');

  return typeof element !== 'undefined'
    ? element.getAttribute('data-insights-filter')
    : undefined;
}
```

In the GTM interface, a new variable called `{{Filters}}` is available and gives you the filters.

## FAQ

### How to change the Search Insights source URL?

By default, the Search Insights source URL targets [jsDelivr CDN](https://www.jsdelivr.com/). If you want to use a specific version of the Search Insights library or to host your own version of the library, you can change the URL:

1. In the "Init" event configuration, go to "Advanced Algolia Settings" and update "Search Insights Source URL"
1. In the "Permissions" template, add the same link in the "[Inject Scripts](https://www.simoahava.com/analytics/custom-templates-guide-for-google-tag-manager/#injects-scripts)" section

## Contributing

Before working on the project, make sure to **disable any ad blockers**.

### Folder structure

The source for the GTM template is in the [`src/`](src) folder and gets generated in the [`generated/`](generated) folder.

### Commands

#### `build`

> Builds the GTM template into the [`generated/`](generated) folder.

Each section of the custom template is in the [`src/`](src) folder. This command compiles the files into a GTM template in [`generated/`](generated).

#### `dev`

> Runs the [`build`](#build) command in watch mode.

### Releasing

The `TEMPLATE_VERSION` variable in the [sandboxed JavaScript](src/template.js) should be incremented for each change. This variable is used to send usage metrics to Algolia.

To release a new version:

- Run the `build` command to update the [generated template](generated/search-insights.tpl)
- Update the [changelog](CHANGELOG.md) manually
- Commit it to GitHub

For users to update the template, they need to download it again and to reimport it in the GTM interface (they won't lose their configuration).

## Credits

Thanks to [David Vallejo](https://www.thyngster.com/) for his initial work on the custom template.

## License

MIT

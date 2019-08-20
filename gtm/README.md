# Search Insights for Google Tag Manager

Google Tag Manager [custom template](https://developers.google.com/tag-manager/templates/) for Algolia Search Insights.

---

<div align="center">

[**Download template**](generated/search-insights.tpl)

</div>

---

## Usage

### 1. Import the template

- Download **[`search-insights.tpl`](generated/search-insights.tpl)**
- Import the file in [Google Tag Manager](https://tagmanager.google.com) (GTM)
  - Go to "Templates"
  - Click on "New"
  - Select "Import" in the menu

### 2. Create variables

For events to be sent with the correct information (`userToken`, `objectIDs`, `queryID`, etc.), you need to add variables in the "User-Defined Variables" section.

[Learn more about GTM variables →](https://www.simoahava.com/analytics/variable-guide-google-tag-manager/)

### 3. Create tags

1. Click "New" in the Tags panel
1. Select the tag type "Algolia Search Insights"
1. Choose the event type and provide the Search Insights options
1. Select the trigger for this event

## FAQ

### How to get the user token?

The user token can be given to GTM via a [Data Layer](https://developers.google.com/tag-manager/devguide#datalayer).

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  userToken: 'USER_1',
});
```

### How to get the object IDs?

The `objectIDs` can be given to GTM via [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

In your InstantSearch template, create a `data-insights-objectid` attribute:

```js
instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: `
<article data-insights-objectid="{{objectID}}">
  <!-- ... -->
</article>
`,
  },
});
```

### How to get the query ID?

The `queryID` can be given to GTM via [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

In your InstantSearch template, create a `data-insights-query` attribute:

```js
instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: `
<article data-insights-query="{{__queryID}}">
  <!-- ... -->
</article>
`,
  },
});
```

> `__queryID` is available from:
>
> - InstantSearch.js 3.4.0
> - React InstantSearch 5.5.0
> - Vue InstantSearch 2.1.0
> - Angular InstantSearch 3.0.0

### How to change the Search Insights endpoint?

By default, the Search Insights endpoint targets [jsDelivr CDN](https://www.jsdelivr.com/). If you want to use a specific version of the Search Insights library or to host your own version of the library, you can change the endpoint:

1. In the "Init" event configuration, go to "Advanced Algolia Settings" and update "Search Insights Endpoint"
1. In the "Permissions" template, add the same link in the "[Inject Scripts](https://www.simoahava.com/analytics/custom-templates-guide-for-google-tag-manager/#injects-scripts)" section

## Contributing

Before starting working on the project, make sure to **disable any ad blockers**.

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

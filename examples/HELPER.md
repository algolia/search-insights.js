
# AlgoliaSearch-helper example
This example describes how to implement algolia-insights library with algoliasearch-helper library. It does not cover [loading the library itself](https://github.com/algolia/algolia-insights/blob/master/README.md#loading). Nor does it cover the larger subject of the [algoliasearch-helper library](https://github.com/algolia/algoliasearch-helper-js/).

## Enabling queryID response
To enable the queryID response from the search API, algoliasearch-helper enables setting custom queryParameters when you instantiate your helper instance like so:

```js
const helper = algoliasearchHelper(client, INDEX_NAME, {
  clickAnalytics: true
});
```

## Initializing search analytics
In order for the algolia-insights library to properly correlate click and conversion events
with the search queries, you need to define the queryID callback function that will return the 
last queryID. We advise you do that once the helper has been instantiated.

```js
helper.search();

aa('initSearch', {
  getQueryID: () => {
    return helper.lastResults && helper.lastResults._rawResults[0].queryID
  }
})
```

## Reporting click and conversion events
When you actually want to trigger a click event will depend on your implementation type and business logic. A good framework would be to send a click event once a user has clicked on something that indicates action inside the hit - for example, when a user clicks on a result (for click events) or when a user adds an item to a cart (for conversions).

This example covers how to obtain the objectID and position for reporting. We advise that you add data-algolia-objectid and data-algolia-position data attributes in your hitTemplate, as it will greatly ease the implementation. 

```js
const hitTemplate = (hit) => `
    <div>
      ...
      <button class="button-click"
        data-objectid="${hit.objectID}" 
        data-position="${hit.__hitIndex + 1}">Click event</button>
      
      <button class="button-conversion"
        data-objectid="${hit.objectID}">Conversion event</button>
      ...
    <div>
  `
}
```

After you've added the information to the DOM, you need to create the handlers to trigger the action.
This can be done by specifying a global onclick event handler and checking the clicked element.

```js
document.addEventListener('click', (e) => {
  if(e.target.matches('.button-click')) {
    window.aa('click', {
      objectID: e.target.getAttribute('data-objectid'),
      position: parseInt(e.target.getAttribute('data-position')) // parseInt as getAttribute always returns a string
    })

  } else if(e.target.matches('.button-conversion')) {
    window.aa('conversion', {
      objectID: e.target.getAttribute('data-objectid')
    })
  }
})
```

### Advanced options - sending click events on right-click
Sometimes - and it is often the case in ecommerce - users right-click and open the product in new tab.
To be able to report those events as click events, you will have to bind a global contextmenu event listener similar to the click event.

```js
document.addEventListener('click', (e) => {
  if(e.target.matches('.button-click')) {
    window.aa('click', {
      objectID: e.target.getAttribute('data-objectid'),
      position: parseInt(e.target.getAttribute('data-position')) // parseInt as getAttribute always returns a string
    })
  }
})
```




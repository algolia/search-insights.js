require("./autocomplete.scss");

// TODO: update autocomplete to support objectID as an array

window.addEventListener("load", () => {
  var client = algoliasearch(process.env.APP_ID, process.env.API_KEY);
  var index = client.initIndex(process.env.INDEX_NAME);

  var ac = autocomplete(
    "#aa-search-input",
    { hint: false },
    {
      source: (query, callback) => {
        index.search(query, { hitsPerPage: 5 }).then(answer => {
          callback(answer.hits);
        });
      },
      params: {
        clickAnalytics: true
      },
      debug: true,
      displayKey: "name",
      templates: {
        suggestion: function(suggestion) {
          return `<div data-algolia-objectid="${suggestion.objectID}">${
            suggestion.name
          }</div>`;
        }
      }
    }
  );

  const source = autocomplete.sources.hits(index, { hitsPerPage: 5 });
});

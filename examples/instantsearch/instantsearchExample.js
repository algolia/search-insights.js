require("./instantsearchExample.scss");

import instantsearch from "instantsearch.js";

import {
  searchBox,
  stats,
  hits,
  pagination,
  hierarchicalMenu,
  refinementList,
  starRating,
  clearAll
} from "instantsearch.js/es/widgets";

var search = instantsearch({
  appId: process.env.APP_ID,
  apiKey: process.env.API_KEY,
  indexName: process.env.INDEX_NAME,
  searchParameters: {
    clickAnalytics: true
  }
});

search.addWidget(
  searchBox({
    container: "#q",
    placeholder: "Search a product"
  })
);

search.addWidget(
  stats({
    container: "#stats"
  })
);

var hitTemplate = hit => `
  <article>
    <div class="product-picture-wrapper">
      <div class="product-picture"><img src="https://image.tmdb.org/t/p/w45${
        hit.image_path
      }" /></div>
    </div>
    <div class="product-desc-wrapper">
      <div class="product-name">${hit._highlightResult.name.value}</div>
    </div>
    <button data-query-id="${hit._queryID}" data-object-id="${
  hit.objectID
}" data-position="${
  hit._hitPosition
}" class="button-click" style="background: blue;padding: 10px 12px; color: white;">click</button>
    <button data-query-id="${hit._queryID}" data-object-id="${
  hit.objectID
}" class="button-convert" style="background: blue;padding: 10px 12px; color: white;">add to cart</button>
  </article>`;

var noResultsTemplate = `<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>`;

var menuTemplate = menu => `
  <div class="facet-item ${menu.isRefined ? "active" : ""}">
    <span class="facet-name">
      <i class="fa fa-angle-right"></i>
      ${menu.name}
    </span class="facet-name">
  </div>`;

var facetTemplateCheckbox =
  '<a href="javascript:void(0);" class="facet-item">' +
  '<input type="checkbox" class="{{cssClasses.checkbox}}" value="{{name}}" {{#isRefined}}checked{{/isRefined}} />{{name}}' +
  '<span class="facet-count">({{count}})</span>' +
  "</a>";

var facetTemplateColors =
  '<a href="javascript:void(0);" data-facet-value="{{name}}" class="facet-color {{#isRefined}}checked{{/isRefined}}"></a>';

search.addWidget(
  hits({
    container: "#hits",
    hitsPerPage: 16,
    templates: {
      empty: noResultsTemplate,
      item: hitTemplate
    },
    transformData: function(hit) {
      var result = search.helper.lastResults;
      var offset = result.hitsPerPage * result.page;

      hit._queryID = result.queryID;
      hit._hitPosition = offset + hit.__hitIndex + 1;

      hit.stars = [];
      for (var i = 1; i <= 5; ++i) {
        hit.stars.push(i <= hit.rating);
      }
      return hit;
    }
  })
);

search.addWidget(
  pagination({
    container: "#pagination",
    cssClasses: {
      active: "active"
    },
    labels: {
      previous: '<i class="fa fa-angle-left fa-2x"></i> Previous page',
      next: 'Next page <i class="fa fa-angle-right fa-2x"></i>'
    },
    showFirstLast: false
  })
);

search.addWidget(
  hierarchicalMenu({
    container: "#categories",
    attributes: ["category", "sub_category", "sub_sub_category"],
    sortBy: ["name:asc"],
    templates: {
      item: menuTemplate
    }
  })
);

search.addWidget(
  refinementList({
    container: "#materials",
    attributeName: "alternative_name",
    operator: "or",
    limit: 10,
    templates: {
      item: facetTemplateCheckbox,
      header: '<div class="facet-title">Materials</div class="facet-title">'
    }
  })
);

search.addWidget(
  refinementList({
    container: "#colors",
    attributeName: "colors",
    operator: "or",
    limit: 10,
    templates: {
      item: facetTemplateColors,
      header: '<div class="facet-title">Colors</div class="facet-title">'
    }
  })
);

search.addWidget(
  starRating({
    container: "#rating",
    attributeName: "rating",
    templates: {
      header: '<div class="facet-title">Ratings</div class="facet-title">'
    }
  })
);

search.addWidget(
  clearAll({
    container: "#clear-all",
    templates: {
      link: '<i class="fa fa-eraser"></i> Clear all filters'
    },
    cssClasses: {
      root: "btn btn-block btn-default"
    },
    autoHideContainer: true
  })
);

search.start();

document.addEventListener("click", e => {
  if (e.target.matches(".button-click")) {
    window.aa("clickedObjectIDsAfterSearch", {
      eventName: "hit-clicked",
      index: process.env.INDEX_NAME,
      queryID: e.target.getAttribute("data-query-id"),
      objectIDs: [e.target.getAttribute("data-object-id")],
      positions: [parseInt(e.target.getAttribute("data-position"))]
    });
  } else if (e.target.matches(".button-convert")) {
    window.aa("convertedObjectIDsAfterSearch", {
      eventName: "hit-converted",
      index: process.env.INDEX_NAME,
      queryID: e.target.getAttribute("data-query-id"),
      objectIDs: [e.target.getAttribute("data-object-id")]
    });
  }
});

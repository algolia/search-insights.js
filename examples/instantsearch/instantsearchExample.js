/* eslint-disable new-cap */
import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import {
  configure,
  searchBox,
  stats,
  hits,
  pagination,
  hierarchicalMenu,
  refinementList,
  ratingMenu,
  clearRefinements,
} from 'instantsearch.js/es/widgets/index.js';

import './instantsearchExample.scss';

const search = instantsearch({
  searchClient: algoliasearch(process.env.APP_ID, process.env.API_KEY),
  indexName: process.env.INDEX_NAME,
});
search.addWidgets([
  configure({
    clickAnalytics: true,
  }),
]);

const hitTemplate = (hit, { html, components }) => html`<article>
  <div class="product-picture-wrapper">
    <div class="product-picture">
      <img src="https://image.tmdb.org/t/p/w45${hit.image_path}" />
    </div>
  </div>
  <div class="product-desc-wrapper">
    <div class="product-name">
      ${components.Highlight({ attribute: 'name', hit })}
    </div>
  </div>
  <button
    data-query-id="${hit._queryID}"
    data-object-id="${hit.objectID}"
    data-position="${hit._hitPosition}"
    class="button-click"
    style="background: blue;padding: 10px 12px; color: white;"
  >
    click
  </button>
  <button
    data-query-id="${hit._queryID}"
    data-object-id="${hit.objectID}"
    class="button-convert"
    style="background: blue;padding: 10px 12px; color: white;"
  >
    add to cart
  </button>
</article>`;

const noResultsTemplate = (results, { html }) =>
  html`<div class="text-center">
    No results found matching <strong>${results.query}</strong>.
  </div>`;

const menuTemplate = (menu) => `
  <div class="facet-item ${menu.isRefined ? 'active' : ''}">
    <span class="facet-name">
      <i class="fa fa-angle-right"></i>
      ${menu.name}
    </span class="facet-name">
  </div>`;

const facetTemplateCheckbox = () =>
  `<a href="javascript:void(0);" class="facet-item">
    <input type="checkbox" class="{{cssClasses.checkbox}}" value="{{name}}" {{#isRefined}}checked{{/isRefined}} />{{name}}
    <span class="facet-count">({{count}})</span>
  </a>`;

const facetTemplateColors = () =>
  '<a href="javascript:void(0);" data-facet-value="{{name}}" class="facet-color {{#isRefined}}checked{{/isRefined}}"></a>';

const searchWidgets = [
  searchBox({
    container: '#q',
    placeholder: 'Search a product',
  }),
  stats({
    container: '#stats',
  }),
  hits({
    container: '#hits',
    hitsPerPage: 16,
    templates: {
      empty: noResultsTemplate,
      item: hitTemplate,
    },
    /* transformItems(hits) {
      return hits.map((hit) => {
        const result = search.helper.lastResults;
        const offset = result.hitsPerPage * result.page;

        hit._queryID = result.queryID;
        hit._hitPosition = offset + hit.__hitIndex + 1;

        hit.stars = [];
        for (let i = 1; i <= 5; ++i) {
          hit.stars.push(i <= hit.rating);
        }
        return hit;
      });
    }, */
  }),
  pagination({
    container: '#pagination',
    cssClasses: {
      active: 'active',
    },
    labels: {
      previous: '<i class="fa fa-angle-left fa-2x"></i> Previous page',
      next: 'Next page <i class="fa fa-angle-right fa-2x"></i>',
    },
    showFirstLast: false,
  }),
  hierarchicalMenu({
    container: '#categories',
    attributes: ['category', 'sub_category', 'sub_sub_category'],
    sortBy: ['name:asc'],
    templates: {
      item: menuTemplate,
    },
  }),
  refinementList({
    container: '#materials',
    attribute: 'alternative_name',
    operator: 'or',
    limit: 10,
    templates: {
      item: facetTemplateCheckbox,
      header: '<div class="facet-title">Materials</div class="facet-title">',
    },
  }),
  refinementList({
    container: '#colors',
    attribute: 'colors',
    operator: 'or',
    limit: 10,
    templates: {
      item: facetTemplateColors,
      header: '<div class="facet-title">Colors</div class="facet-title">',
    },
  }),
  ratingMenu({
    container: '#rating',
    attribute: 'rating',
    templates: {
      header: '<div class="facet-title">Ratings</div class="facet-title">',
    },
  }),
  clearRefinements({
    container: '#clear-all',
    templates: {
      link: '<i class="fa fa-eraser"></i> Clear all filters',
    },
    cssClasses: {
      root: 'btn btn-block btn-default',
    },
    autoHideContainer: true,
  }),
];

search.addWidgets(searchWidgets);

search.start();

const matches = (elem, selector) => {
  const fn = elem.matches || elem.msMatchesSelector;
  return fn.call(elem, selector);
};

document.addEventListener('click', (e) => {
  if (matches(e.target, '.button-click')) {
    window.aa('clickedObjectIDsAfterSearch', {
      eventName: 'hit-clicked',
      index: process.env.INDEX_NAME,
      queryID: e.target.getAttribute('data-query-id'),
      objectIDs: [e.target.getAttribute('data-object-id')],
      positions: [parseInt(e.target.getAttribute('data-position'), 10)],
    });
  } else if (matches(e.target, '.button-convert')) {
    window.aa('convertedObjectIDsAfterSearch', {
      eventName: 'hit-converted',
      index: process.env.INDEX_NAME,
      queryID: e.target.getAttribute('data-query-id'),
      objectIDs: [e.target.getAttribute('data-object-id')],
    });
  }
});

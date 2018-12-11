
require('./helper.scss');

import algoliasearch from 'algoliasearch'
import algoliasearchHelper from 'algoliasearch-helper'

const { API_KEY, APP_ID, INDEX_NAME } = process.env;

const client = algoliasearch(APP_ID, API_KEY),
      helper = algoliasearchHelper(client, INDEX_NAME, {
        clickAnalytics: true
      });

const input = document.querySelector('#q'),
      hitsContainer = document.querySelector('#hits');

input.addEventListener('input', (e) => {
  helper.setQuery(e.target.value).search();
})

helper.on('result', function(content) {
  renderHits(content);
});

const hit = (hit, index) => {
  return `
    <div className="col-3">${hit.name}
      <button onclick="aa('click',{objectID: [${hit.objectID}], position: [${index + 1}]})">Click</button>
      <button onclick="aa('conversion',{objectID: [${hit.objectID}]})">Conversion</button>
    </div>`
  }

function renderHits(content) {
  const html = content.hits.map(hit).join('')
  hitsContainer.innerHTML = html;
}

helper.search();

aa('initSearch', {
  getQueryID: () => {
    return helper.lastResults.queryID
  }
})

import React, { Component } from 'react';
import {
  InstantSearch,
  Configure,
  SearchBox,
  Pagination,
  Highlight,
} from 'react-instantsearch/dom';
import {
  connectStateResults,
  connectHits,
} from 'react-instantsearch/connectors';
// import './App.css';

const Analytics = connectStateResults(({ searchResults }) => {
  window.aa('initSearch', {
    getQueryID: () => searchResults && searchResults._rawResults[0].queryID,
  });

  return null;
});

const Hits = connectHits(
  connectStateResults(({ hits, searchResults }) => (
    <div>
      {hits.map((hit, index) => (
        <div key={hit.objectID}>
          <Highlight attributeName="name" hit={hit} />
          <button
            onClick={() => {
              window.aa('click', {
                eventName: "hit-clicked",
                index: process.env.INDEX_NAME,
                queryID: searchResults.queryID,
                objectIDs: [hit.objectID],
                positions:
                  [searchResults.hitsPerPage * searchResults.page + index + 1],
              });
            }}
          >
            Click event
          </button>
          <button
            onClick={() => {
              window.aa('conversion', {
                eventName: "hit-converted",
                index: process.env.INDEX_NAME,
                queryID: searchResults.queryID,
                objectIDs: [hit.objectID],
              });
            }}
          >
            Conversion event
          </button>
        </div>
      ))}
    </div>
  ))
);

class App extends Component {
  render() {
    return (
      <InstantSearch
        appId={process.env.APP_ID}
        apiKey={process.env.API_KEY}
        indexName={process.env.INDEX_NAME}>
        <Configure hitsPerPage={8} clickAnalytics />
        <Analytics />

        <SearchBox />

        <div className="twoColumns">
          <Hits />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Pagination />
        </div>
      </InstantSearch>
    );
  }
}

export default App;

<template>
  <div id="app" class="container-fluid">
    <ais-index :searchStore="searchStore" :queryParameters="{clickAnalytics: true}" :indexName="process.env.INDEX_NAME">
      <div class="row">
        <div class="col-md-2 col-sm-3">
          <h1 class="head-title">
            Demo Store
          </h1>
        </div>
        <div class="col-md-10 col-sm-9">
          <ais-search-box>
            <div class="input-group">
              <ais-input
              placeholder="Search product by name or reference..."
              :classNames="{
                'ais-input': 'form-control'
                }"
              />
              <span class="input-group-btn">
                <ais-clear :classNames="{'ais-clear': 'btn btn-default'}">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </ais-clear>
                <button class="btn btn-default" type="submit">
                  <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                </button>
              </span>
            </div>
          </ais-search-box>
        </div>
      </div>

      <div class="row">

        <div class="col-md-10 col-sm-9">
          <div class="search-controls form-inline">
            <ais-results-per-page-selector :options="[12, 24, 48]" :classNames="{'ais-results-per-page-selector': 'form-control' }"/>
            <ais-powered-by />
            <ais-stats/>
          </div>

          <ais-results>
            <template slot-scope="{result, index}">
              <div class="search-result">
                <button @click="convert({result})">Buy immediately now!!!</button>
                <h2 class="result__name" @click="report({result, index})" style="{cursor: 'pointer'}">
                  {{prefix + index + 1}}. <ais-highlight :result="result" attribute-name="name"/>
                </h2>
              </div>
            </template>
          </ais-results>

          <ais-no-results/>

          <ais-pagination class="pagination" :classNames="{
            'ais-pagination': 'pagination',
            'ais-pagination__item--active': 'active',
            'ais-pagination__item--disabled': 'disabled'
            }"/>

        </div>
      </div>
    </ais-index>

  </div>
</template>

<script>
// load Insights
!function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){(e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)[0],i.async=1,i.src=process.env.SCRIPT_SRC,c.parentNode.insertBefore(i,c)}(window,document,"script",0,"aa");

aa('init', {
  apiKey: process.env.API_KEY,
  applicationID: process.env.APP_ID
})

import { createFromAlgoliaCredentials } from "vue-instantsearch";

// create a search store, because we need to access it for the queryID
const searchStore = createFromAlgoliaCredentials(
  process.env.APP_ID,
  process.env.API_KEY
);
// get the query ID
searchStore._helper.once("search", () => {
  aa("initSearch", {
    getQueryID: () =>
      searchStore._helper.lastResults &&
      searchStore._helper.lastResults._rawResults[0].queryID,
  });
});

export default {
  name: "app",
  methods: {
    // reporting a click on a result
    report({ result: {objectID}, index }) {
      // prefix = page (0-based) * hitsPerPage
      // position is 1-based
      const position = this.prefix + index + 1;
      window.aa("click", {
        eventName: "hit-clicked",
        indexName: process.env.INDEX_NAME,
        objectID: [objectID],
        position: [position]
      });
    },
    // reporting a conversion
    convert({ result: { objectID } }) {
      window.aa("conversion", {
        eventName: "hit-converted",
        indexName: process.env.INDEX_NAME,
        objectID: [objectID]
      });
    },
  },
  computed: {
    searchStore() {
      return searchStore;
    },
    prefix() {
      return (searchStore.page - 1) * searchStore.resultsPerPage;
    },
  },
};
</script>


<style lang="scss" rel="stylesheet/scss">
#app {
  -webkit-font-smoothing: antialiased;
  padding-top: 20px;
}

.head-title {
  margin-top: 0;
}

.ais-powered-by {
  float: right;

  line-height: 26px;
  svg {
    vertical-align: bottom;
  }
}

.search-controls {
  padding-bottom: 20px;
}

.ais-stats {
  line-height: 36px;
}

.ais-results:after {
  content: " ";
  display: block;
  clear: both;
}

.search-result {
  padding: 10px 20px 20px;
  width: 24%;
  margin-bottom: 10px;
  border: solid 1px #eee;
  box-shadow: 0 0 3px #f6f6f6;
  margin-right: 1%;
  position: relative;
  border-radius: 3px;
  min-width: 220px;
  background: #fff;
  display: inline;
  float: left;
  transition: all 0.5s;
}

.result__name mark,
.result__type mark {
  font-style: normal;
  background: rgba(143, 187, 237, 0.1);
  box-shadow: inset 0 -1px 0 0 rgba(69, 142, 225, 0.8);
}

.result__type mark {
  background: rgba(143, 187, 237, 0.1);
  border-radius: 0;
  box-shadow: inset 0 -1px 0 0 rgba(69, 142, 225, 0.8);
}

.ais-results-per-page-selector {
  float: right;
  margin-right: 10px;
}

/* Clear Search */
.ais-clear--disabled {
  display: none;
}
</style>

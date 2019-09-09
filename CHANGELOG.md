# [1.3.0-beta.0](https://github.com/algolia/search-insights.js/compare/v1.2.0...v1.3.0-beta.0) (2019-09-09)


### Bug Fixes

* remove startWith and use indexOf instead ([#129](https://github.com/algolia/search-insights.js/issues/129)) ([9c79e20](https://github.com/algolia/search-insights.js/commit/9c79e20))
* **bug:** persist function reference after library is loaded ([#128](https://github.com/algolia/search-insights.js/issues/128)) ([662bf64](https://github.com/algolia/search-insights.js/commit/662bf64))
* **compat:** node compatibility ([#140](https://github.com/algolia/search-insights.js/issues/140)) ([e804bd1](https://github.com/algolia/search-insights.js/commit/e804bd1)), closes [#141](https://github.com/algolia/search-insights.js/issues/141) [#143](https://github.com/algolia/search-insights.js/issues/143) [#144](https://github.com/algolia/search-insights.js/issues/144) [#142](https://github.com/algolia/search-insights.js/issues/142)
* **getUserToken:** add integration tests ([#114](https://github.com/algolia/search-insights.js/issues/114)) ([c02c178](https://github.com/algolia/search-insights.js/commit/c02c178))
* **processQueue:** move callback on method level ([#115](https://github.com/algolia/search-insights.js/issues/115)) ([1ff8191](https://github.com/algolia/search-insights.js/commit/1ff8191))



# [1.2.0](https://github.com/algolia/search-insights.js/compare/v1.1.1...v1.2.0) (2019-04-24)


### Bug Fixes

* **processQueue:** extract globalObject from processQueue for easier testing ([#106](https://github.com/algolia/search-insights.js/issues/106)) ([9b56fd9](https://github.com/algolia/search-insights.js/commit/9b56fd9))


### Features

* **getUserToken:** add a way to get user token ([#107](https://github.com/algolia/search-insights.js/issues/107)) ([29786e1](https://github.com/algolia/search-insights.js/commit/29786e1))



## [1.1.1](https://github.com/algolia/search-insights.js/compare/v1.1.0...v1.1.1) (2019-04-11)


### Bug Fixes

* **UserAgent:** change shape of user agent to reflect other flavours ([#109](https://github.com/algolia/search-insights.js/issues/109)) ([cc1babf](https://github.com/algolia/search-insights.js/commit/cc1babf))



# [1.1.0](https://github.com/algolia/search-insights.js/compare/v1.0.1...v1.1.0) (2019-04-11)


### Bug Fixes

* **typos:** various minor unrelated fixes  ([#102](https://github.com/algolia/search-insights.js/issues/102)) ([bb8875b](https://github.com/algolia/search-insights.js/commit/bb8875b))


### Features

* **UserAgent:** add user agent string ([#100](https://github.com/algolia/search-insights.js/issues/100)) ([09141a1](https://github.com/algolia/search-insights.js/commit/09141a1))
* **UserAgent:** introduce addAlgoliaAgent method ([#105](https://github.com/algolia/search-insights.js/issues/105)) ([927e74e](https://github.com/algolia/search-insights.js/commit/927e74e))
* **version:** expose version in main class ([#99](https://github.com/algolia/search-insights.js/issues/99)) ([12bd554](https://github.com/algolia/search-insights.js/commit/12bd554))



## [1.0.1](https://github.com/algolia/search-insights.js/compare/v1.0.0...v1.0.1) (2019-01-17)


### Bug Fixes

* **docs:** remove queryID helper for perso  ([9ce20ca](https://github.com/algolia/search-insights.js/commit/9ce20ca))
* **examples:** update them to use 1.0.0 ([44b049e](https://github.com/algolia/search-insights.js/commit/44b049e))
* **README.md:** typo ([e018bb3](https://github.com/algolia/search-insights.js/commit/e018bb3))


### Features

* **doc:** add migration section ([282aa0e](https://github.com/algolia/search-insights.js/commit/282aa0e))



# [1.0.0](https://github.com/algolia/search-insights.js/compare/v0.0.17...v1.0.0) (2018-12-17)


### Bug Fixes

* **examples:** update payloads ([#65](https://github.com/algolia/search-insights.js/issues/65)) ([825f524](https://github.com/algolia/search-insights.js/commit/825f524))
* **timestamp:** make timestamp optional ([#50](https://github.com/algolia/search-insights.js/issues/50)) ([b44d29d](https://github.com/algolia/search-insights.js/commit/b44d29d)), closes [#46](https://github.com/algolia/search-insights.js/issues/46) [#32](https://github.com/algolia/search-insights.js/issues/32)
* **types:** add InsightEventType 'view' ([31c4564](https://github.com/algolia/search-insights.js/commit/31c4564))


### Features

* **cookieDuration:** add cookieDuration support ([#61](https://github.com/algolia/search-insights.js/issues/61)) ([66a4a69](https://github.com/algolia/search-insights.js/commit/66a4a69))
* **userToken:** accepting provided userToken ([#64](https://github.com/algolia/search-insights.js/issues/64)) ([f7d63ee](https://github.com/algolia/search-insights.js/commit/f7d63ee))
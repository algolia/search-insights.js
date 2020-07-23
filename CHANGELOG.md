# [1.5.0](https://github.com/algolia/search-insights.js/compare/v1.4.0...v1.5.0) (2020-07-23)


### Features

* **browser:** expose createInsightsClient ([#213](https://github.com/algolia/search-insights.js/issues/213)) ([7880205](https://github.com/algolia/search-insights.js/commit/788020598064bc5f9c71ba0b1cf5a20109195fb8))
* **get:** add _get function ([#216](https://github.com/algolia/search-insights.js/issues/216)) ([3173c9b](https://github.com/algolia/search-insights.js/commit/3173c9bcefb15c9c9b166636dabef6945e555f6f))
* add `onUserTokenChange` to know when token is assigned ([#209](https://github.com/algolia/search-insights.js/issues/209)) ([1e5bd42](https://github.com/algolia/search-insights.js/commit/1e5bd42f48530106f62855bba22a0a4b612bce8d))
* export `createInsightsClient` for node env ([#203](https://github.com/algolia/search-insights.js/issues/203)) ([4f04869](https://github.com/algolia/search-insights.js/commit/4f048697a44763c23a03c311bfe6d7a9f5367641)), closes [#204](https://github.com/algolia/search-insights.js/issues/204) [#204](https://github.com/algolia/search-insights.js/issues/204)



# [1.4.0](https://github.com/algolia/search-insights.js/compare/v1.3.1...v1.4.0) (2020-02-17)


### Bug Fixes

* **gtm:** add Algolia Agent after `init` ([9640dc2](https://github.com/algolia/search-insights.js/commit/9640dc2677c931cdfd1e278834c54fe169381ba6))
* **gtm:** forward `eventName` to all events ([1209301](https://github.com/algolia/search-insights.js/commit/12093016e424e0a0fce3fe803cc5388d5a905219))
* **types:** remove optional types on main methods ([#192](https://github.com/algolia/search-insights.js/issues/192)) ([e551d10](https://github.com/algolia/search-insights.js/commit/e551d106464edbcc5304047d398a7b0df48c0823))


### Features

* **sendEvent:** return the value of the request function ([#200](https://github.com/algolia/search-insights.js/issues/200)) ([56b4ffd](https://github.com/algolia/search-insights.js/commit/56b4ffd0e878a02767f9553ef9dce26bf6dc6d26)), closes [#199](https://github.com/algolia/search-insights.js/issues/199)



# [1.3.0](https://github.com/algolia/search-insights.js/compare/v1.2.0...v1.3.0) (2019-09-18)


### Bug Fixes

* **IE11:** remove startWith and use indexOf instead ([#129](https://github.com/algolia/search-insights.js/issues/129)) ([9c79e20](https://github.com/algolia/search-insights.js/commit/9c79e20))
* **bug:** persist function reference after library is loaded ([#128](https://github.com/algolia/search-insights.js/issues/128)) ([662bf64](https://github.com/algolia/search-insights.js/commit/662bf64))
* **compat:** node compatibility ([#140](https://github.com/algolia/search-insights.js/issues/140)) ([e804bd1](https://github.com/algolia/search-insights.js/commit/e804bd1)), closes [#141](https://github.com/algolia/search-insights.js/issues/141) [#143](https://github.com/algolia/search-insights.js/issues/143) [#144](https://github.com/algolia/search-insights.js/issues/144) [#142](https://github.com/algolia/search-insights.js/issues/142)
* **processQueue:** move callback on method level ([#115](https://github.com/algolia/search-insights.js/issues/115)) ([1ff8191](https://github.com/algolia/search-insights.js/commit/1ff8191))



# [1.2.0](https://github.com/algolia/search-insights.js/compare/v1.1.1...v1.2.0) (2019-04-24)


### Features

* **getUserToken:** add a way to get user token ([#107](https://github.com/algolia/search-insights.js/issues/107)) ([29786e1](https://github.com/algolia/search-insights.js/commit/29786e1))



## [1.1.1](https://github.com/algolia/search-insights.js/compare/v1.1.0...v1.1.1) (2019-04-11)


### Bug Fixes

* **UserAgent:** change shape of user agent to reflect other flavours ([#109](https://github.com/algolia/search-insights.js/issues/109)) ([cc1babf](https://github.com/algolia/search-insights.js/commit/cc1babf))



# [1.1.0](https://github.com/algolia/search-insights.js/compare/v1.0.1...v1.1.0) (2019-04-11)



### Features

* **UserAgent:** add user agent string ([#100](https://github.com/algolia/search-insights.js/issues/100)) ([09141a1](https://github.com/algolia/search-insights.js/commit/09141a1))
* **UserAgent:** introduce addAlgoliaAgent method ([#105](https://github.com/algolia/search-insights.js/issues/105)) ([927e74e](https://github.com/algolia/search-insights.js/commit/927e74e))
* **version:** expose version in main class ([#99](https://github.com/algolia/search-insights.js/issues/99)) ([12bd554](https://github.com/algolia/search-insights.js/commit/12bd554))



## [1.0.1](https://github.com/algolia/search-insights.js/compare/v1.0.0...v1.0.1) (2019-01-17)


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

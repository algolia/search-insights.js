# [1.10.0](https://github.com/algolia/search-insights.js/compare/v1.9.0...v1.10.0) (2023-03-16)


### Features

* expose version string from functional interface ([#408](https://github.com/algolia/search-insights.js/issues/408)) ([2517044](https://github.com/algolia/search-insights.js/commit/25170444c3401b501ea542684524fc83ab389d89))
* make `init` optional ([#422](https://github.com/algolia/search-insights.js/issues/422)) ([371b2a9](https://github.com/algolia/search-insights.js/commit/371b2a9343ceecf5f7165aa63dcbd3ec68942cb8))
* allow to `init` again while preserving passed options ([#403](https://github.com/algolia/search-insights.js/issues/403)) ([d3f8de5](https://github.com/algolia/search-insights.js/commit/d3f8de53bd65363584ebce518d0354fd30195d46))
* pass custom credentials as additional arguments of insights methods ([#400](https://github.com/algolia/search-insights.js/issues/400)) ([5054302](https://github.com/algolia/search-insights.js/commit/50543020c3cee21adba553d65ecc1d1e55dbbb20))



# [1.9.0](https://github.com/algolia/search-insights.js/compare/v1.8.0...v1.9.0) (2023-02-16)


### Features

* **api:** expose window.AlgoliaAnalyticsObject if not yet set ([#391](https://github.com/algolia/search-insights.js/issues/391)) ([59c479c](https://github.com/algolia/search-insights.js/commit/59c479cf1f70736fb96a2e271b6390777be45855))



# [1.8.0](https://github.com/algolia/search-insights.js/compare/v1.7.2...v1.8.0) (2021-04-28)


### Bug Fixes

* **types:** expose the types of public methods ([#259](https://github.com/algolia/search-insights.js/issues/259)) ([d59afaa](https://github.com/algolia/search-insights.js/commit/d59afaa24ed88d28bad7ae936becb5038d12765b))


### Features

* add getVersion method ([#260](https://github.com/algolia/search-insights.js/issues/260)) ([c15a47c](https://github.com/algolia/search-insights.js/commit/c15a47c2d79f47ff3abd1beac3bdddd5822c0c8d))



## [1.7.2](https://github.com/algolia/search-insights.js/compare/v1.7.1...v1.7.2) (2021-04-26)


### Bug Fixes

* **types:** export default ([#257](https://github.com/algolia/search-insights.js/issues/257)) ([55dd748](https://github.com/algolia/search-insights.js/commit/55dd748af67bf83c7f13d3e4bb4f195394df3f33))
* **types:** export default in the type definition ([#247](https://github.com/algolia/search-insights.js/issues/247)) ([10044fc](https://github.com/algolia/search-insights.js/commit/10044fc0f7a9807e43d41e5333632f657d24f3ed))
* **userToken:** prevent anonymous user token from overriding existing token ([#251](https://github.com/algolia/search-insights.js/issues/251)) ([738e5d9](https://github.com/algolia/search-insights.js/commit/738e5d9e2a9c416104949ca3509b65e7cb790079))



## [1.7.1](https://github.com/algolia/search-insights.js/compare/v1.7.0...v1.7.1) (2021-01-25)


### Bug Fixes

* **types:** emit and publish type definitions to npm ([#243](https://github.com/algolia/search-insights.js/issues/243)) ([074f037](https://github.com/algolia/search-insights.js/commit/074f0371d0da9227c6d8b1cbc98077d6ee22b551))



# [1.7.0](https://github.com/algolia/search-insights.js/compare/v1.6.3...v1.7.0) (2021-01-13)


### Bug Fixes

* use browser requester on browser with bundler ([#238](https://github.com/algolia/search-insights.js/issues/238)) ([df62ffd](https://github.com/algolia/search-insights.js/commit/df62ffd31f2efd7437d8da4e8f53b4efc796a08c))
* warn about unknown function name ([#237](https://github.com/algolia/search-insights.js/issues/237)) ([dd46015](https://github.com/algolia/search-insights.js/commit/dd46015fc1a28c86a39c58042a294855ce912c1d))


### Features

* **init(userToken):** accept new parameter `userToken` at init() method ([#241](https://github.com/algolia/search-insights.js/issues/241)) ([29216c6](https://github.com/algolia/search-insights.js/commit/29216c60ce7a7310071ba9250b9227ae2a7f1d2c))
* **init(useCookie):** accept new parameter `useCookie` which skips anonymous userToken when `false` is given ([#236](https://github.com/algolia/search-insights.js/issues/236)) ([db09c7e](https://github.com/algolia/search-insights.js/commit/db09c7ee4065c67b9c58226516f53231da2fad79))



## [1.6.3](https://github.com/algolia/search-insights.js/compare/v1.6.2...v1.6.3) (2020-11-02)


### Bug Fixes

* do not store anonymous token in cookie when user has opted out ([#233](https://github.com/algolia/search-insights.js/issues/233)) ([8669b67](https://github.com/algolia/search-insights.js/commit/8669b675338f0f76f12be1af57484bfd07e57cbe))



## [1.6.2](https://github.com/algolia/search-insights.js/compare/v1.6.1...v1.6.2) (2020-09-02)


### Bug Fixes

* **commonJS:** fix mixed exports issue ([#224](https://github.com/algolia/search-insights.js/issues/224)) ([24b97e3](https://github.com/algolia/search-insights.js/commit/24b97e304e6bb71054e47fe79a5357af24cf3f4b))



## [1.6.1](https://github.com/algolia/search-insights.js/compare/v1.6.0...v1.6.1) (2020-08-28)


### Bug Fixes

* **package:** include empty module ([c4cf25d](https://github.com/algolia/search-insights.js/commit/c4cf25df23936edeca68876e4a93cdd9c97444df))



# [1.6.0](https://github.com/algolia/search-insights.js/compare/v1.5.0...v1.6.0) (2020-08-13)


### Features

* **react-native:** shim native node modules ([#220](https://github.com/algolia/search-insights.js/issues/220)) ([713cbf9](https://github.com/algolia/search-insights.js/commit/713cbf9b2937713fd9ff2d4b5501c0a1e94dd4ae))



# [1.5.0](https://github.com/algolia/search-insights.js/compare/v1.4.0...v1.5.0) (2020-07-23)


### Features

* **browser:** expose createInsightsClient ([#213](https://github.com/algolia/search-insights.js/issues/213)) ([7880205](https://github.com/algolia/search-insights.js/commit/788020598064bc5f9c71ba0b1cf5a20109195fb8))
* **get:** add `_get` function to get instance variables ([#216](https://github.com/algolia/search-insights.js/issues/216)) ([3173c9b](https://github.com/algolia/search-insights.js/commit/3173c9bcefb15c9c9b166636dabef6945e555f6f))
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

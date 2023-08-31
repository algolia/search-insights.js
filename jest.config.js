/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: [
    "./jest.setup.js"
  ],
  transformIgnorePatterns: [
    "<rootDir>/lib/polyfills/*.js"
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  globals: {
    "__DEV__": true,
    "__FLAVOR__": "node-cjs"
  }
};
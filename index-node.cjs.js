const aa = require('./dist/search-insights.node.cjs.js');

// workaround because we mix default and named exports
module.exports = aa.default;
Object.keys(aa).forEach((key) => {
  if (key !== 'default') {
    module.exports[key] = aa[key];
  }
});

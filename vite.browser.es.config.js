const config = require("./vite.browser.base.config");

config.build.lib.formats = ["es", "cjs"];
config.define = { __UMD__: false };

module.exports = config;

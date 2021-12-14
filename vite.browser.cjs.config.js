const config = require("./vite.browser.base.config");

config.build.lib.formats = ["cjs"];
config.define = { __UMD__: false };

module.exports = config;

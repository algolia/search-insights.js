const config = require("./vite.browser.base.config");

config.build.lib.formats = ["umd", "iife"];
config.define = { __UMD__: true };

module.exports = config;

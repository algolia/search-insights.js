const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/entry-browser-umd.ts"),
      name: "AlgoliaAnalytics",
      fileName: (format) => `search-insights.browser.${format}.js`,
      formats: ["umd", "iife"]
    },
    rollupOptions: {
      output: {
        exports: "named"
      }
    }
  }
});

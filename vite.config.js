const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/entry.ts"),
      name: "AlgoliaAnalytics",
      fileName: (format) => `search-insights.${format}.js`,
      formats: ["cjs", "es", "iife", "umd"]
    },
    rollupOptions: {
      output: {
        exports: "named"
      }
    }
  }
});

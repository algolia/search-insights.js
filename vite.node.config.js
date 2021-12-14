const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/entry-node.ts"),
      name: "AlgoliaAnalytics",
      fileName: (format) => `search-insights.node.${format}.js`,
      formats: ["cjs"]
    },
    rollupOptions: {
      output: {
        exports: "named"
      }
    }
  }
});

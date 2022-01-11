/// <reference types="vitest" />

import { defineConfig } from "vite";
import replace from "@rollup/plugin-replace";
import path from "path";

module.exports = defineConfig({
  test: {
    include: ["**/*.node.test.(js|ts)"],
    environment: "node",
    setupFiles: ["tests/setup.node.ts"]
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/entry-node.ts"),
      name: "AlgoliaAnalytics",
      fileName: (format) => `search-insights.node.${format}.js`,
      formats: ["cjs"]
    },
    rollupOptions: {
      plugins: [
        replace({
          __DEV__: 'process.env.NODE_ENV === "development"',
          __FLAVOR__: "'node-cjs'"
        })
      ],
      output: {
        exports: "named"
      }
    }
  }
});

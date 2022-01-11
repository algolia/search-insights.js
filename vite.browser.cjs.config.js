/// <reference types="vitest" />

import { defineConfig } from "vite";
import replace from "@rollup/plugin-replace";
import path from "path";

export default defineConfig({
  test: {
    include: ["**/*.test.(js|ts)"],
    exclude: ["**/*.node.test.(js|ts)", "node_modules/**"],
    environment: "jsdom",
    global: true,
    setupFiles: ["tests/setup.browser.ts"]
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/entry-browser-cjs.ts"),
      name: "AlgoliaAnalytics",
      fileName: (format) => `search-insights.browser.${format}.js`,
      formats: ["cjs"]
    },
    rollupOptions: {
      plugins: [
        replace({
          __DEV__: 'process.env.NODE_ENV === "development"',
          __FLAVOR__: "'browser-cjs'"
        })
      ],
      output: {
        exports: "named"
      }
    }
  }
});

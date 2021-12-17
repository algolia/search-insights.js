const path = require('path');

const replace = require('@rollup/plugin-replace');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/entry-browser-cjs.ts'),
      name: 'AlgoliaAnalytics',
      fileName: (format) => `search-insights.browser.${format}.js`,
      formats: ['cjs'],
    },
    rollupOptions: {
      plugins: [
        replace({
          __DEV__: 'process.env.NODE_ENV === "development"',
          __FLAVOR__: "'browser-cjs'",
        }),
      ],
      output: {
        exports: 'named',
      },
    },
  },
});

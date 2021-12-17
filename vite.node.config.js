const path = require('path');

const replace = require('@rollup/plugin-replace');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/entry-node.ts'),
      name: 'AlgoliaAnalytics',
      fileName: (format) => `search-insights.node.${format}.js`,
      formats: ['cjs'],
    },
    rollupOptions: {
      plugins: [
        replace({
          __DEV__: 'process.env.NODE_ENV === "development"',
          __FLAVOR__: "'node-cjs'",
        }),
      ],
      output: {
        exports: 'named',
      },
    },
  },
});

import buble from '@rollup/plugin-buble';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import filesize from 'rollup-plugin-filesize';
import { uglify } from 'rollup-plugin-uglify';

const MODULE_NAME = 'AlgoliaAnalytics';
const LIBRARY_OUTPUT_NAME = 'search-insights';

const browserPlugins = [
  typescript(),
  nodeResolve(),
  json({
    preferConst: true,
    compact: true,
  }),
  buble({
    transforms: {
      generator: false,
      dangerousForOf: true,
      asyncAwait: false,
    },
  }),
  uglify(),
  filesize(),
];

const nodePlugins = [
  typescript(),
  nodeResolve(),
  json({
    preferConst: true,
    compact: true,
  }),
];

export default [
  {
    input: 'src/browser.ts',
    output: {
      format: 'umd',
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.min.js`,
    },
    plugins: browserPlugins,
  },
  {
    input: 'src/node.ts',
    output: {
      format: 'cjs',
      file: `./dist/${LIBRARY_OUTPUT_NAME}-node.cjs`,
    },
    external: ['js-cookie', 'node-fetch'],
    plugins: nodePlugins,
  },
  {
    input: 'src/node.ts',
    output: {
      format: 'es',
      file: `./dist/${LIBRARY_OUTPUT_NAME}-node.mjs`,
    },
    external: ['js-cookie', 'node-fetch'],
    plugins: nodePlugins,
  },
  {
    input: 'src/browser.ts',
    output: {
      format: 'es',
      file: `./dist/${LIBRARY_OUTPUT_NAME}.min.mjs`,
    },
    plugins: browserPlugins,
  },
];

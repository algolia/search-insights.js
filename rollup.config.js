import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';

const MODULE_NAME = 'AlgoliaAnalytics';
const LIBRARY_OUTPUT_NAME = 'search-insights';

const createPlugins = ({ format, flavor }) => [
  typescript(),
  resolve({
    preferBuiltins: false,
  }),
  json({
    preferConst: true,
    compact: true,
  }),
  replace({
    __DEV__:
      format === 'umd' || format === 'iife'
        ? false
        : 'process.env.NODE_ENV === "development"',
    __FLAVOR__: JSON.stringify(flavor),
    exclude: ['package.json'],
  }),
  buble(),
  commonjs(),
  uglify(),
  filesize(),
];

export default [
  {
    input: 'lib/entry-umd.ts',
    output: {
      format: 'umd',
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.min.js`,
      globals: {},
    },
    plugins: createPlugins({ format: 'umd', flavor: 'browser-umd' }),
  },
  {
    input: 'lib/entry-node-cjs.ts',
    output: {
      format: 'cjs',
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-node.cjs.min.js`,
    },
    external: ['http', 'https'],
    plugins: createPlugins({ format: 'cjs', flavor: 'node-cjs' }),
  },
  {
    input: 'lib/entry-browser-cjs.ts',
    output: {
      format: 'cjs',
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-browser.cjs.min.js`,
    },
    external: ['http', 'https'],
    plugins: createPlugins({ format: 'cjs', flavor: 'browser-cjs' }),
  },
  {
    input: 'lib/entry-umd.ts',
    output: {
      format: 'iife',
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.iife.min.js`,
    },
    plugins: createPlugins({ format: 'iife', flavor: 'browser-iife' }),
  },
];

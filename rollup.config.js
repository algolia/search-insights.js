
import buble from 'rollup-plugin-buble';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from "rollup-plugin-json";
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript';

const MODULE_NAME = 'AlgoliaAnalytics',
      LIBRARY_OUTPUT_NAME = 'search-insights';

export default {
  entry: 'lib/insights.ts',
  format: 'umd',
  moduleName: 'AlgoliaAnalytics',
  plugins: [
    typescript(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    json({
      preferConst: true,
      compact: true
    }),
    buble(),
    commonjs(),
    uglify(),
    filesize()
  ],
  targets: [
    { dest: `./dist/${LIBRARY_OUTPUT_NAME}.min.js`, format: 'umd' },
  ],
};

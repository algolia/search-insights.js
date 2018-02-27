import buble from 'rollup-plugin-buble';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
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
    commonjs(),
    uglify(),
    filesize(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  targets: [
    { dest: `./dist/${LIBRARY_OUTPUT_NAME}.min.js`, format: 'umd' },
  ],
};

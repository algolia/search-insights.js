import buble from "rollup-plugin-buble";
import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript";

const MODULE_NAME = "AlgoliaAnalytics",
  LIBRARY_OUTPUT_NAME = "search-insights";

const createPlugins = ({ browser }) => [
  typescript(),
  resolve({
    browser,
    preferBuiltins: false
  }),
  json({
    preferConst: true,
    compact: true
  }),
  buble(),
  commonjs(),
  uglify(),
  filesize()
];

export default [
  {
    input: "lib/insights.ts",
    output: {
      format: "umd",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.min.js`,
      globals: {}
    },
    plugins: createPlugins({ browser: true })
  },
  {
    input: "lib/insights.ts",
    output: {
      format: "cjs",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.cjs.min.js`
    },
    external: ["http"],
    plugins: createPlugins({ browser: false })
  }
];

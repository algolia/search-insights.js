import buble from "rollup-plugin-buble";
import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript";
import replace from "rollup-plugin-replace";

const MODULE_NAME = "AlgoliaAnalytics",
  LIBRARY_OUTPUT_NAME = "search-insights";

const createPlugins = ({ format }) => [
  typescript(),
  resolve({
    preferBuiltins: false
  }),
  json({
    preferConst: true,
    compact: true
  }),
  replace({
    __DEV__:
      format === "umd" || format === "iife"
        ? false
        : 'process.env.NODE_ENV === "development"',
    exclude: ["package.json"]
  }),
  buble(),
  commonjs(),
  uglify(),
  filesize()
];

export default [
  {
    input: "lib/entry-umd.ts",
    output: {
      format: "umd",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.min.js`,
      globals: {}
    },
    plugins: createPlugins({ format: "umd" })
  },
  {
    input: "lib/entry-node-cjs.ts",
    output: {
      format: "cjs",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-node.cjs.min.js`
    },
    external: ["http", "https"],
    plugins: createPlugins({ format: "cjs" })
  },
  {
    input: "lib/entry-browser-cjs.ts",
    output: {
      format: "cjs",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-browser.cjs.min.js`
    },
    external: ["http", "https"],
    plugins: createPlugins({ format: "cjs" })
  },
  {
    input: "lib/entry-umd.ts",
    output: {
      format: "iife",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.iife.min.js`
    },
    plugins: createPlugins({ format: "iife" })
  }
];

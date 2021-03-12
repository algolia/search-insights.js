import buble from "rollup-plugin-buble";
import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript";

const MODULE_NAME = "AlgoliaAnalytics",
  LIBRARY_OUTPUT_NAME = "search-insights";

const createPlugins = () => [
  typescript(),
  resolve({
    preferBuiltins: false
  }),
  json({
    preferConst: true,
    compact: true
  }),
  buble(),
  commonjs(),
  // uglify(),
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
    plugins: createPlugins()
  },
  {
    input: "lib/entry-node-cjs.ts",
    output: {
      format: "cjs",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-node.cjs.min.js`
    },
    external: ["http", "https"],
    plugins: createPlugins()
  },
  {
    input: "lib/entry-browser-cjs.ts",
    output: {
      format: "cjs",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-browser.cjs.min.js`
    },
    external: ["http", "https"],
    plugins: createPlugins()
  }
];

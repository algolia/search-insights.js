import buble from "@rollup/plugin-buble";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";

const MODULE_NAME = "AlgoliaAnalytics",
  LIBRARY_OUTPUT_NAME = "search-insights";

const createPlugins = ({ format, flavor }) => [
  typescript(),
  resolve({
    preferBuiltins: false
  }),
  json({
    preferConst: true,
    compact: true
  }),
  replace({
    preventAssignment: true,

    __DEV__:
      format === "umd" || format === "iife" || format === "esm"
        ? false
        : 'process.env.NODE_ENV === "development"',
    __FLAVOR__: JSON.stringify(flavor),
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
      exports: "named",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.min.js`,
      globals: {}
    },
    plugins: createPlugins({ format: "umd", flavor: "browser-umd" })
  },
  {
    input: "lib/entry-node-cjs.ts",
    output: {
      format: "cjs",
      exports: "named",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-node.cjs.min.js`
    },
    external: ["http", "https"],
    plugins: createPlugins({ format: "cjs", flavor: "node-cjs" })
  },
  {
    input: "lib/entry-browser-cjs.ts",
    output: {
      format: "cjs",
      exports: "named",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-browser.cjs.min.js`
    },
    external: ["http", "https"],
    plugins: createPlugins({ format: "cjs", flavor: "browser-cjs" })
  },
  {
    input: "lib/entry-umd.ts",
    output: {
      format: "iife",
      exports: "named",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}.iife.min.js`
    },
    plugins: createPlugins({ format: "iife", flavor: "browser-iife" })
  },
  {
    input: "lib/entry-browser-cjs.ts",
    output: {
      format: "esm",
      file: `./dist/${LIBRARY_OUTPUT_NAME}.esm.js`
    },
    plugins: createPlugins({ format: "esm", flavor: "browser-esm" })
  },
  {
    input: "index-browser.cjs.js",
    output: {
      format: "esm",
      file: `index-browser.esm.js`
    },
    plugins: createPlugins({ format: "esm", flavor: "browser-esm" })
  },
  {
    input: "index-node.cjs.js",
    output: {
      format: "esm",
      file: `index-node.esm.js`
    },
    plugins: createPlugins({ format: "esm", flavor: "node-esm" })
  },
];

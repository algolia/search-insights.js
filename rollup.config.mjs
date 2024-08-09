import buble from "@rollup/plugin-buble";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import filesize from "rollup-plugin-filesize";
import { uglify } from "rollup-plugin-uglify";

const MODULE_NAME = "AlgoliaAnalytics";
const LIBRARY_OUTPUT_NAME = "search-insights";

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
  ...(["node-cjs", "node-esm"].includes(flavor) ? [] : [uglify()]),
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
    input: "lib/entry-node.ts",
    output: {
      format: "cjs",
      exports: "named",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-node.cjs`
    },
    external: ["http", "https"],
    plugins: createPlugins({ format: "cjs", flavor: "node-cjs" })
  },
  {
    input: "lib/entry-browser.ts",
    output: {
      format: "cjs",
      exports: "named",
      name: MODULE_NAME,
      file: `./dist/${LIBRARY_OUTPUT_NAME}-browser.min.cjs`
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
    input: "lib/entry-browser.ts",
    output: {
      format: "esm",
      file: `./dist/${LIBRARY_OUTPUT_NAME}-browser.mjs`
    },
    plugins: createPlugins({ format: "esm", flavor: "browser-esm" })
  },
  {
    input: "lib/entry-node.ts",
    output: {
      format: "esm",
      file: `./dist/${LIBRARY_OUTPUT_NAME}-node.mjs`
    },
    plugins: createPlugins({ format: "esm", flavor: "node-esm" })
  }
];

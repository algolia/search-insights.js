#!/usr/bin/env node

/* eslint-disable import/no-commonjs, no-console */
const PATH = "dist/search-insights.cjs.min.js";
const fs = require("fs");
const content = fs.readFileSync(PATH).toString();
let updated = false;
const lines = content.split(";").map(line => {
  if (!line.startsWith("exports")) {
    return line;
  }

  const pieces = line.split(",");
  if (pieces[pieces.length - 1] !== "exports.default=node") {
    throw new Error(
      `It doesn't contain \`exports.default=node\`. Something isn't right!`
    );
  }

  //    from: `exports.createInsightsClient=createInsightsClient,exports.default=node`
  //      to: `module.exports=node;module.exports.createInsightsClient=createInsightsClient`
  // related: https://github.com/rollup/rollup/issues/1961
  const convertedLine = [
    "module.exports=node",
    ...pieces.slice(0, pieces.length - 1).map(piece => {
      if (!piece.startsWith("exports.")) {
        throw new Error(`This does not start with \`exports.\`.\n  > ${piece}`);
      }
      return `module.${piece}`;
    })
  ].join(",");

  return convertedLine;
});

fs.writeFileSync(PATH, lines.join(";"));

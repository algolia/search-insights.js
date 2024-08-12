const fs = require("fs");
const path = require("path");

module.exports = {
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;
    if (releaseType === "patch" && fix === 0) {
      return false;
    }
    return true;
  },
  buildCommand: () => "yarn build && /bin/bash ./pre-deploy.sh",
  versionUpdated: ({ version, dir }) => {
    // update version in `docs/requirejs.md`
    const requirejsDocsPath = path.resolve(dir, "docs", "requirejs.md");
    const requirejsDocs = fs.readFileSync(requirejsDocsPath).toString();
    const updatedRequirejsDocs = requirejsDocs.replace(
      /(\/search-insights@)([^\/]+)(\/dist)/,
      `$1${version}$3`
    );
    fs.writeFileSync(requirejsDocsPath, updatedRequirejsDocs);
  },
  pullRequestTeamReviewers: ["events-platform"]
};

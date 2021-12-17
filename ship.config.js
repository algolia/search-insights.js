const fs = require("fs");
const path = require("path");

module.exports = {
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;
    if (releaseType === 'patch' && fix === 0) {
      return false;
    }
    return true;
  },
  buildCommand: () => "yarn build && /bin/bash ./pre-deploy.sh",
  pullRequestTeamReviewers: ["@algolia/instantsearch-for-websites"],
  versionUpdated: ({ version, releaseType, dir }) => {
    fs.writeFileSync(
      path.resolve(dir, 'lib', '_version.ts'),
      `export const version = '${version}';\n`
    );

    if (
      releaseType === "major" ||
      releaseType === "minor" ||
      releaseType === "patch"
    ) {
      const readmePath = path.resolve(dir, "README.md");
      let content = fs.readFileSync(readmePath).toString();
      const regex = /cdn\.jsdelivr\.net\/npm\/search-insights@(\d+?\.\d+?\.\d+?)/;
      const newUrl = `cdn.jsdelivr.net/npm/search-insights@${version}`;
      content = content.replace(regex, newUrl);
      fs.writeFileSync(readmePath, content);
    }
  }
};

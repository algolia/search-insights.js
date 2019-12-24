const fs = require("fs");
const path = require("path");

module.exports = {
  mergeStrategy: {
    toSameBranch: ["maint"],
    toReleaseBranch: {
      develop: "master"
    }
  },
  buildCommand: () => "yarn build && /bin/bash ./pre-deploy.sh",
  pullRequestReviewer: ["@algolia/instantsearch-for-websites"],
  versionUpdated: ({ version, dir }) => {
    const readmePath = path.resolve(dir, "README.md");
    let content = fs.readFileSync(readmePath).toString();
    const regex = /cdn\.jsdelivr\.net\/npm\/search-insights@(\d+?\.\d+?\.\d+?)/;
    const newUrl = `cdn.jsdelivr.net/npm/search-insights@${version}`;
    content = content.replace(regex, newUrl);
    fs.writeFileSync(readmePath, content);
  }
};

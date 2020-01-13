module.exports = {
  mergeStrategy: {
    toSameBranch: ["v0"]
  },
  buildCommand: () => "yarn build && /bin/bash ./pre-deploy.sh",
  pullRequestReviewer: ["@algolia/instantsearch-for-websites"],
  versionUpdated: ({ version, releaseType, dir }) => {
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

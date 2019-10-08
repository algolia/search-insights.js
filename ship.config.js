module.exports = {
  mergeStrategy: {
    toSameBranch: ["maint"],
    toReleaseBranch: {
      develop: "master"
    }
  },
  buildCommand: () => "yarn build && /bin/bash ./pre-deploy.sh",
  pullRequestReviewer: "@algolia/instantsearch-for-websites"
};

module.exports = {
  baseBranches: ["maint", "develop"],
  mergeStrategy: {
    toSameBranch: ["maint"],
    toReleaseBranch: {
      develop: "master"
    }
  },
  buildCommand: () => "yarn build && /bin/bash ./pre-deploy.sh"
};

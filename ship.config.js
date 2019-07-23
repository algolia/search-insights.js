module.exports = {
  baseBranches: ["maint", "develop", "chore/add-shipjs"],
  mergeStrategy: {
    toSameBranch: ["maint", "chore/add-shipjs"],
    toReleaseBranch: {
      develop: "master"
    }
  },
  buildCommand: () => "yarn build && /bin/bash ./pre-deploy.sh"
};

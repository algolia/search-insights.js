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
  pullRequestTeamReviewers: ["event-experiences"]
};

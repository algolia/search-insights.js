import { createInsightsClient } from "./_createInsightsClient";

if (__UMD__) {
  createInsightsClient();
}

export default function () {
  console.log("my-lib");
}
export const version = "0.0.1";

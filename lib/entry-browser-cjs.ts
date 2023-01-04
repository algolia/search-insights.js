import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForBrowser } from "./utils/getRequesterForBrowser";
import { processQueue } from "./_processQueue";
import { createInsightsClient } from "./_createInsightsClient";

export {
  getRequesterForBrowser,
  AlgoliaAnalytics,
  getFunctionalInterface,
  processQueue
};
export * from "./types";

const aa = createInsightsClient(getRequesterForBrowser());
// @ts-ignore
window._test = aa;
export default aa;

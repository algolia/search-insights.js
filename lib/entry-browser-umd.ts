import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForBrowser } from "./utils/getRequesterForBrowser";
import { processQueue } from "./_processQueue";
import { createInsightsClientForUMD as createInsightsClient } from "./_createInsightsClient";

export {
  createInsightsClient,
  getRequesterForBrowser,
  AlgoliaAnalytics,
  getFunctionalInterface,
  processQueue
};
export * from "./types";

export default createInsightsClient(getRequesterForBrowser());

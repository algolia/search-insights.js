import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForBrowser } from "./utils/getRequesterForBrowser";
import { getRequesterForNode } from "./utils/getRequesterForNode";
import { processQueue } from "./_processQueue";
import { RequestFnType } from "./utils/request";

export {
  getRequesterForBrowser,
  getRequesterForNode,
  AlgoliaAnalytics,
  getFunctionalInterface,
  processQueue
};

export function createInsightsClient(requestFn: RequestFnType) {
  return getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));
}

export default createInsightsClient(getRequesterForBrowser());

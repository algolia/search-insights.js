import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForBrowser } from "./utils/getRequesterForBrowser";
import { getRequesterForNode } from "./utils/getRequesterForNode";
import { RequestFnType } from "./utils/request";

export {
  AlgoliaAnalytics,
  getFunctionalInterface,
  getRequesterForBrowser,
  getRequesterForNode
};

export function createInsightsClient(requestFn: RequestFnType) {
  return getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));
}

export default createInsightsClient(getRequesterForBrowser());

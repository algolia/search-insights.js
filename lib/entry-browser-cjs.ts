import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForBrowser } from "./utils/getRequesterForBrowser";
import { RequestFnType } from "./utils/request";

export { getRequesterForBrowser };
export * from "./types";

export function createInsightsClient(requestFn: RequestFnType) {
  return getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));
}

export default createInsightsClient(getRequesterForBrowser());

import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForNode } from "./utils/getRequesterForNode";
import { RequestFnType } from "./utils/request";

export { getRequesterForNode };
export * from "./types";

export function createInsightsClient(requestFn: RequestFnType) {
  return getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));
}

export default createInsightsClient(getRequesterForNode());

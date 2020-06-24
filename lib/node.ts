import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForNode } from "./utils/getRequesterForNode";

export function createInsightsClient(requester) {
  const instance = new AlgoliaAnalytics({ requestFn: requester });
  const functionalInterface = getFunctionalInterface(instance);
  return functionalInterface;
}

const requestFn = getRequesterForNode();
const insightsClient = createInsightsClient(requestFn);
export default insightsClient;

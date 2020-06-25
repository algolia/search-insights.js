import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForNode } from "./utils/getRequesterForNode";

export function createInsightsClient(requestFn) {
  const instance = new AlgoliaAnalytics({ requestFn });
  const functionalInterface = getFunctionalInterface(instance);
  return functionalInterface;
}

const requestFn = getRequesterForNode();
const insightsClient = createInsightsClient(requestFn);
export default insightsClient;

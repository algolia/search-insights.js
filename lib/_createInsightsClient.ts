import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { RequestFnType } from "./utils/request";

export function createInsightsClient(requestFn: RequestFnType) {
  return getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));
}

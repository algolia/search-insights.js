import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { RequestFnType } from "./utils/request";
import { processQueue } from "./_processQueue";

export function createInsightsClient(requestFn: RequestFnType) {
  return getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));
}

export function createInsightsClientForUMD(requestFn: RequestFnType) {
  const instance = new AlgoliaAnalytics({ requestFn });
  if (typeof window !== "undefined") {
    // Process queue upon script execution
    processQueue.call(instance, window);
  }
  return getFunctionalInterface(instance);
}

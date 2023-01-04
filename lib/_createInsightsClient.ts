import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { RequestFnType } from "./utils/request";

export function createInsightsClient(requestFn: RequestFnType) {
  const aaInterface = getFunctionalInterface(
    new AlgoliaAnalytics({ requestFn })
  );
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.aaInterface = aaInterface;
  }
  return aaInterface;
}

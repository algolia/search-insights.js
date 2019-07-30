import AlgoliaAnalytics from "../lib/insights";
import { processQueue } from "../lib/_processQueue";

export function getInstance() {
  return new AlgoliaAnalytics();
}

export function getInstanceForBrowser() {
  const instance = getInstance();
  if (typeof window !== "undefined") {
    // Process queue upon script execution
    processQueue.call(instance, window);
  }
  return instance;
}

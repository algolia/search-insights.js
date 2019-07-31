import AlgoliaAnalytics from "./insights";
import { processQueue } from "./_processQueue";
import { getFunctionalInterface } from "./_getFunctionalInterface";

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

export function getInstanceForNode() {
  const instance = new AlgoliaAnalytics();
  const functionalInterface = getFunctionalInterface(instance);
  return functionalInterface;
}

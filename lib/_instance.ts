import AlgoliaAnalytics from "./insights";
import { processQueue } from "./_processQueue";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import {
  getRequester,
  getRequesterForBrowser,
  getRequesterForNode
} from "./utils/request";

export function getInstance() {
  const requestFn = getRequester();
  return new AlgoliaAnalytics({ requestFn });
}

export function getInstanceForBrowser() {
  const requestFn = getRequesterForBrowser();
  const instance = new AlgoliaAnalytics({ requestFn });
  if (typeof window !== "undefined") {
    // Process queue upon script execution
    processQueue.call(instance, window);
  }
  return instance;
}

export function getInstanceForNode() {
  const requestFn = getRequesterForNode();
  const instance = new AlgoliaAnalytics({ requestFn });
  const functionalInterface = getFunctionalInterface(instance);
  return functionalInterface;
}

import AlgoliaAnalytics from "../lib/insights";
import { processQueue } from "../lib/_processQueue";
import {
  getRequesterForBrowser,
  getRequesterForNode,
  getRequester
} from "../lib/utils/request";
import getAa from "../lib/_getAa";

export function getInstance() {
  const requestFn = getRequester();
  const instance = new AlgoliaAnalytics({ requestFn });
  return instance;
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

export function getAaForNode() {
  const requestFn = getRequesterForNode();
  const instance = new AlgoliaAnalytics({ requestFn });
  const aa = getAa(instance);
  return aa;
}

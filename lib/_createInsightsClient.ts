import { getFunctionalInterface } from './_getFunctionalInterface';
import { processQueue } from './_processQueue';
import AlgoliaAnalytics from './insights';
import type { RequestFnType } from './utils/request';

export function createInsightsClient(requestFn: RequestFnType) {
  return getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));
}

export function createInsightsClientForUMD(requestFn: RequestFnType) {
  const instance = new AlgoliaAnalytics({ requestFn });
  if (typeof window !== 'undefined') {
    // Process queue upon script execution
    processQueue.call(instance, window);
  }
  return getFunctionalInterface(instance);
}

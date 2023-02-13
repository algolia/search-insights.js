import { processQueue } from './_processQueue';
import AlgoliaAnalytics from './insights';
import { getRequesterForBrowser } from './utils/getRequesterForBrowser';
import type { RequestFnType } from './utils/request';

export function createInsightsClient(requestFn: RequestFnType) {
  const instance = new AlgoliaAnalytics({ requestFn });
  if (typeof window === 'object') {
    // Process queue upon script execution
    processQueue.call(instance, window);
  }
  return instance;
}

export default createInsightsClient(getRequesterForBrowser());

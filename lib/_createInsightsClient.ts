import { getFunctionalInterface } from './_getFunctionalInterface';
import AlgoliaAnalytics from './insights';
import type { RequestFnType } from './utils/request';
import { createUUID } from './utils/uuid';

export function createInsightsClient(requestFn: RequestFnType) {
  const aa = getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));

  if (typeof window === 'object') {
    if (!window.AlgoliaAnalyticsObject) {
      let pointer: string;
      do {
        pointer = createUUID();
      } while (window[pointer] !== undefined);
      window.AlgoliaAnalyticsObject = pointer;
      window[window.AlgoliaAnalyticsObject] = aa;
    }
  }

  return aa;
}

import { getFunctionalInterface } from './_getFunctionalInterface';
import AlgoliaAnalytics from './insights';
import type { RequestFnType } from './utils/request';

export function createInsightsClient(requestFn: RequestFnType) {
  return getFunctionalInterface(new AlgoliaAnalytics({ requestFn }));
}

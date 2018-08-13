import { AnalyticsEvent } from './_sendEvent';

export interface SearchReport extends AnalyticsEvent {
  query: string;
  index: string;
}

/**
 * Triggers a search event
 * @param params: SearchParams
 */
export function search(params: SearchReport) {
  if (!params) {
    throw new Error(
      'Search functions has to be called with a query string, which cannot be undefined'
    );
  } else if (!params.index) {
    throw new Error('Please provide index of the index being searched');
  }

  // Send click event
  this.sendEvent('search', params);
}

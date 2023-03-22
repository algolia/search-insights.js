/**
 * Browser entrypoint.
 * This is the script that is loaded via the install snippet.
 */

import { AlgoliaInsights } from './insights';

declare global {
  interface Window {
    insights: AlgoliaInsights;
    AlgoliaAnalyticsObject?: string;
  }
}

window.insights = new AlgoliaInsights(
  window.insights ?? [],
  window[window.AlgoliaAnalyticsObject ?? 'aa']
);

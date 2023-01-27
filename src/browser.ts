/**
 * Browser entrypoint.
 * This is the script that is loaded via the install snippet.
 */

import { AlgoliaInsights } from './insights';

declare global {
  interface Window {
    insights: AlgoliaInsights;
  }
}

window.insights = new AlgoliaInsights(window.insights || []);

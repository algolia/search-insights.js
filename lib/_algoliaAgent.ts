import { version } from "../package.json";

export const DEFAULT_ALGOLIA_AGENT = `insights-js (${version})`;

export function addAlgoliaAgent(algoliaAgent) {
  if (this._ua.indexOf(`; ${algoliaAgent}`) === -1) {
    this._ua += `; ${algoliaAgent}`;
    this._uaURIEncoded = encodeURIComponent(this._ua);
  }
}

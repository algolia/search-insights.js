import { InsightsClient } from "./types";

declare module "*/package.json";

declare const __DEV__: boolean;
declare const __FLAVOR__: string;

declare global {
  interface Window {
    aaInterface: InsightsClient;
  }
}

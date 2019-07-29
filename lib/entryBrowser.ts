import AlgoliaAnalytics from "./insights";
import { getRequesterForBrowser } from "./utils/request";

const processQueue = typeof window !== "undefined";
const requestFn = getRequesterForBrowser();
const instance = new AlgoliaAnalytics({ processQueue, requestFn });

export default instance;

import AlgoliaAnalytics from "./insights";
import { getRequesterForBrowser } from "./utils/getRequesterForBrowser";
import { processQueue } from "./_processQueue";

const requestFn = getRequesterForBrowser();
const instance = new AlgoliaAnalytics({ requestFn });
if (typeof window !== "undefined") {
  // Process queue upon script execution
  processQueue.call(instance, window);
}

export default instance;

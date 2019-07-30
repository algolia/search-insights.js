import AlgoliaAnalytics from "./insights";
import { processQueue } from "./_processQueue";

const instance = new AlgoliaAnalytics({ processQueue });
if (typeof window !== "undefined") {
  // Process queue upon script execution
  processQueue.call(instance, window);
}

export default instance;

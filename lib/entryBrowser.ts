import AlgoliaAnalytics from "./insights";

const processQueue = typeof window !== "undefined";
export default new AlgoliaAnalytics({ processQueue });

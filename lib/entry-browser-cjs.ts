import { createInsightsClient } from "./_createInsightsClient";
import { getRequesterForBrowser } from "./utils/getRequesterForBrowser";
import { getRequesterForNode } from "./utils/getRequesterForNode";

export { getRequesterForBrowser, getRequesterForNode };
export * from "./types";

export default createInsightsClient(getRequesterForBrowser());

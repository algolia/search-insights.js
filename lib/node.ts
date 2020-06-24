import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForNode } from "./utils/getRequesterForNode";

const requestFn = getRequesterForNode();
const instance = new AlgoliaAnalytics({ requestFn });
const functionalInterface = getFunctionalInterface(instance);

export { getFunctionalInterface, AlgoliaAnalytics };

export default functionalInterface;

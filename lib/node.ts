import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
import { getRequesterForNode } from "./utils/request";

const requestFn = getRequesterForNode();
const instance = new AlgoliaAnalytics({ requestFn });
const functionalInterface = getFunctionalInterface(instance);

export default functionalInterface;

import AlgoliaAnalytics from "./insights";
import { getRequesterForNode } from "./utils/request";
import getAa from "./_getAa";

const requestFn = getRequesterForNode();
const instance = new AlgoliaAnalytics({ requestFn });
const aa = getAa(instance);

export default aa;

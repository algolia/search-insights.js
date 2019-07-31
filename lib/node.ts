import AlgoliaAnalytics from "./insights";
import { getFunctionalInterface } from "./_getFunctionalInterface";
const instance = new AlgoliaAnalytics();
const functionalInterface = getFunctionalInterface(instance);
export default functionalInterface;

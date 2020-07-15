import { isFunction } from "./utils";
import AlgoliaAnalytics from "./insights";

export function getFunctionalInterface(instance: AlgoliaAnalytics) {
  return (functionName: string, ...functionArguments: any[]) => {
    if (functionName && isFunction((instance as any)[functionName])) {
      return instance[functionName](...functionArguments);
    }
  };
}

import { isFunction } from "./utils";
import AlgoliaAnalytics from "./insights";

export default function getAa(instance: AlgoliaAnalytics) {
  return (functionName: string, ...functionArguments: any[]) => {
    if (functionName && isFunction((instance as any)[functionName])) {
      instance[functionName](...functionArguments);
    }
  };
}

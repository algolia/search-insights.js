/**
 * Processes queue that might have been set before
 * the script was actually loaded and reassigns
 * class over globalObject variable to execute commands
 * instead of putting them to the queue
 */
import { isFunction } from "./utils";

export function processQueue(globalObject) {
  // Set pointer which allows renaming of the script
  const pointer = globalObject["AlgoliaAnalyticsObject"] as string;

  // Check if there is a queue
  if (pointer) {
    const queue: IArguments[] = globalObject[pointer].queue || [];

    // Loop queue and execute functions in the queue
    queue.forEach((args: IArguments) => {
      const [functionName, ...functionArguments] = [].slice.call(args);
      if (functionName && isFunction((this as any)[functionName])) {
        this[functionName](...functionArguments);
      }
    });

    // Reassign pointer
    globalObject[pointer] = (
      functionName: string,
      ...functionArguments: any[]
    ) => {
      (this as any)[functionName](...functionArguments);
    };
  }
}

/**
 * Processes queue that might have been set before
 * the script was actually loaded and reassigns
 * class over window variable to execute commands
 * instead of putting them to the queue
 * @return {[type]} [description]
 */
import { isFunction } from "./utils";

export function processQueue(globalObject) {
  // Set pointer which allows renaming of the script
  const pointer = globalObject["AlgoliaAnalyticsObject"] as any;

  // Check if there is a queue
  if (pointer) {
    const queue = globalObject[pointer].queue || [];

    // Loop queue and execute functions in the queue
    queue.forEach((fn: any[]) => {
      const functionName: string = fn[0];
      const functionArguments: any = fn[1];
      const functionCallback: (err: any, res: any) => void = fn[2];

      if (functionName && isFunction((this as any)[functionName])) {
        const output: any = this[functionName](functionArguments);
        if (isFunction(functionCallback)) {
          functionCallback(null, output);
        }
      }
    });

    // Reassign pointer
    globalObject[pointer] = (
      functionName: string,
      functionArguments: string,
      functionCallback: (err: any, res: any) => void
    ) => {
      const output = (this as any)[functionName](functionArguments);
      if (isFunction(functionCallback)) {
        functionCallback(null, output);
      }
    };
  }
}

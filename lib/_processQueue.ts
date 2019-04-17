/**
 * Processes queue that might have been set before
 * the script was actually loaded and reassigns
 * class over globalObject variable to execute commands
 * instead of putting them to the queue
 */
import { isFunction } from "./utils";

type QueueItemCallback = (err: any, res: any) => void;
type QueueItem = [string, any, QueueItemCallback?];

export function processQueue(globalObject) {
  // Set pointer which allows renaming of the script
  const pointer = globalObject["AlgoliaAnalyticsObject"] as string;

  // Check if there is a queue
  if (pointer) {
    const queue: QueueItem[] = globalObject[pointer].queue || [];

    // Loop queue and execute functions in the queue
    queue.forEach(([functionName, functionArguments, functionCallback]) => {
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
      functionArguments: any,
      functionCallback: QueueItemCallback
    ) => {
      const output = (this as any)[functionName](functionArguments);
      if (isFunction(functionCallback)) {
        functionCallback(null, output);
      }
    };
  }
}

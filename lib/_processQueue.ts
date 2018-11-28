/**
 * Processes queue that might have been set before
 * the script was actually loaded and reassigns
 * class over window variable to execute commands
 * instead of putting them to the queue
 * @return {[type]} [description]
 */
export function processQueue() {
  // Set pointer which allows renaming of the script
  const pointer = window["AlgoliaAnalyticsObject"] as any;

  // Check if there is a queue
  if (pointer) {
    const queue = window[pointer].queue || [];

    // Loop queue and execute functions in the queue
    queue.forEach((fn: string[]) => {
      const functionName = fn[0];
      const functionArguments = fn[1];

      if (functionName && typeof (this as any)[functionName] === "function") {
        this[functionName](functionArguments);
      }
    });

    // Reassign pointer
    window[pointer] = (functionName: string, functionArguments: string) => {
      (this as any)[functionName](functionArguments);
    };
  }
}

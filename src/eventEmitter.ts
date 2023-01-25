export type EventEmitterCallback = (eventName: string, data: unknown) => void;

export class EventEmitter {
  private handlers: { [handlerName: string]: EventEmitterCallback[] } = {};

  emit(type: string, data: any) {
    const handlerFuncs = this.handlers[type];
    if (!handlerFuncs || handlerFuncs.length === 0) {
      return;
    }

    handlerFuncs.forEach((fn) => {
      try {
        fn(type, data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    });
  }

  /**
   * Register event callback function for type.
   */
  on(type: string, callback: EventEmitterCallback) {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }

    this.handlers[type].push(callback);
  }
}

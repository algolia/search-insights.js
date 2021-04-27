import { isFunction } from "./utils";

export function getVersion(callback: (version: string) => void) {
  if (isFunction(callback)) {
    callback(this.version);
  }
}

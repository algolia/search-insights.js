export function ready(callback: Function) {
  if (typeof callback === "function") {
    callback();
  }
}

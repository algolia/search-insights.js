export type GetCallback = (value: any) => void;

export function get(key: string, callback: GetCallback) {
  callback(this[key]);
}

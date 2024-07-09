/**
 * A utility class for safely interacting with localStorage.
 */
export class LocalStorage {
  static readonly THRESHOLD = 0.9;

  /**
   * Safely get a value from localStorage.
   * If the value is not able to be parsed as JSON, this method will return null.
   *
   * @param key - String value of the key.
   * @returns Null if the key is not found or unable to be parsed, the value otherwise.
   */
  static get<T>(key: string): T | null {
    const val = localStorage.getItem(key);
    if (!val) {
      return null;
    }

    try {
      return JSON.parse(val) as T;
    } catch (e) {
      return null;
    }
  }

  /**
   * Safely set a value in localStorage.
   * If the storage is full, this method will catch the error and log a warning.
   *
   * @param key - String value of the key.
   * @param value - Any value to store.
   */
  static set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // eslint-disable-next-line no-console
      console.error(
        `Unable to set ${key} in localStorage, storage may be full.`
      );
    }
  }

  /**
   * Remove a value from localStorage.
   *
   * @param key - String value of the key.
   */
  static remove(key: string): void {
    localStorage.removeItem(key);
  }
}

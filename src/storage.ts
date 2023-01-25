/**
 * Storage is an abstraction around localStorage that captures errors.
 */
export class Storage {
  /**
   * Returns the current value associated with the given key, or null if the given key does not exist.
   *
   * @param key - The identifying key of the value to retrieve.
   * @returns The value associated with the provided key.
   */
  static get(key: string) {
    const storedContent = localStorage.getItem(key);
    if (!storedContent) {
      return null;
    }

    try {
      return JSON.parse(storedContent);
    } catch (error) {
      return storedContent;
    }
  }

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   * Any error returned by localStorage.setItem is caught and logged using console.error.
   *
   * @param key - A string containing the name of the key you want to create/update.
   * @param item - The value to store in localStorage.
   */
  static set(key: string, item: any) {
    let contentToStore = item;
    if (typeof item === 'object') {
      contentToStore = JSON.stringify(item);
    }

    try {
      localStorage.setItem(key, contentToStore);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`failed to store "${key}" in localStorage`);
    }
  }
}

/**
 * Storage is an abstraction around localStorage that captures errors.
 */
export class Storage {
  /**
   * Returns the current value associated with the given key, or null if the given key does not exist.
   * @param {string} key
   * @returns {string|object|null}
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
   * @param {string} key
   * @param {string|object} item
   */
  static set(key: string, item: any) {
    let contentToStore = item;
    if (typeof item === 'object') {
      contentToStore = JSON.stringify(item);
    }

    try {
      localStorage.setItem(key, contentToStore);
    } catch (error) {
      console.error(`failed to store "${key}" in localStorage`);
    }
  }
}

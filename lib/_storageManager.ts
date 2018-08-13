function storageAvailable(type: string) {
  try {
    var storage = (window as any)[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
    );
  }
}

export interface Store {
  [key: string]: {
    queryID: string;
    eventTimestamp: number;
  };
}

// LocalStorage Key
export const LOCALSTORAGE_KEY = 'insights-store';

/**
 * LocalStorage Manager for tracking objectID -> queryID references
 */
export class StorageManager {
  _storageKey: string;

  constructor() {
    if (!storageAvailable('localStorage')) {
      throw new Error('LocalStorage is not available');
    }

    // Assign storage key to instance
    this._storageKey = LOCALSTORAGE_KEY;

    // On init invalidate old localStorage entries.
    // Assuming client time as user is likely
    // on the same time locale and machine
    const currentTimeStamp = new Date().getTime(),
      data = this.getStorageData();

    // Clean storage
    const cleanStore = this.cleanOldStorage(currentTimeStamp, data);
    // Save new store
    localStorage.setItem(this._storageKey, JSON.stringify(cleanStore));
  }

  /**
   * Store click <-> objectID relationship in localStorage
   */
  public storeClick = (objectID: string | number, queryID: string) => {
    // Read store
    let store: Store = JSON.parse(localStorage.getItem('insights-store')) || {};

    // Reassign latest ID
    store[objectID] = {
      queryID,
      eventTimestamp: new Date().getTime()
    };

    // Store it back
    localStorage.setItem(this._storageKey, JSON.stringify(store));
  };

  /**
   * Get conversionObjectID
   */
  public getConversionObjectID = (objectID: string): string => {
    const storeData = this.getStorageData();
    const storage = storeData[objectID];

    // If there is no queryID associated to this object,
    // conversion likely did not happen as a product of a search operation, thus
    // discard the conversion event
    if (!storage || !storage.queryID) {
      return undefined;
    } else {
      return storage.queryID;
    }
  };

  /**
   * Invalidate old storage that exceeds 6h timestamp
   */
  private cleanOldStorage = (currentTimeStamp: number, storage: Store) => {
    const keys = Object.keys(storage);
    // Check if store is not empty
    if (keys.length > 0) {
      // Reduce new store
      let newStore = keys.reduce((store, key) => {
        const timeEntry = storage[key],
          hourDiff =
            Math.abs(currentTimeStamp - timeEntry.eventTimestamp) / 36e5;

        if (hourDiff <= 6) {
          store[key] = timeEntry;
        }

        return store;
      }, {});

      return newStore;
    }

    return {};
  };

  /**
   * GetStorageData
   */
  private getStorageData = (): Store => {
    return JSON.parse(localStorage.getItem('insights-store')) || {};
  };
}

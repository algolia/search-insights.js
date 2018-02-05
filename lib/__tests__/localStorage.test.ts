
import { Store, LOCALSTORAGE_KEY, StorageManager } from '../_storageManager';

const credentials = {
  apiKey: 'test',
  applicationID: 'test'
}

describe('LocalStorageManager',() => {

  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
  });

  it('should clean old clicks', () => {
    const currentTimeStamp = new Date().getTime(),
          hour = 1000 * 60 * 60;

    const initialStore: Store = {
      'queryID_0': {
        eventTimestamp: new Date(currentTimeStamp + hour/2).getTime(),
        queryID: 'a'
      },
      'queryID_1': {
        eventTimestamp: new Date(currentTimeStamp + hour * 2).getTime(),
        queryID: 'ab'
      },
      'queryID_2': {
        eventTimestamp: new Date(currentTimeStamp + hour * 7).getTime(),
        queryID: 'abc'
      },
      'queryID_3': {
        eventTimestamp: new Date(currentTimeStamp + hour * 8).getTime(),
        queryID: 'abcd'
      },
      'queryID_4': {
        eventTimestamp: new Date(currentTimeStamp + hour * 16).getTime(),
        queryID: 'abcd'
      }
    }

    // Set initial state
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(initialStore));

    // Create storage instance
    const storageInstance = new StorageManager();

    expect(localStorage.setItem).toHaveBeenLastCalledWith(LOCALSTORAGE_KEY, JSON.stringify({
      'queryID_0': {
        eventTimestamp: new Date(currentTimeStamp + hour/2).getTime(),
        queryID: 'a'
      },
      'queryID_1': {
        eventTimestamp: new Date(currentTimeStamp + hour * 2).getTime(),
        queryID: 'ab'
      }
    }));
  })
})


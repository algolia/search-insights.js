import { jest } from '@jest/globals';

import { version } from '../_version';
import AlgoliaAnalytics from '../insights';
import { getRequesterForBrowser } from '../utils/getRequesterForBrowser';

const credentials = {
  apiKey: 'testKey',
  appId: 'testId',
};

function setupInstance(requestFn = getRequesterForBrowser()) {
  const instance = new AlgoliaAnalytics({ requestFn });
  instance.init(credentials);
  instance.setUserToken('mock-user-id');
  return instance;
}

describe('sendEvents', () => {
  let XMLHttpRequest;

  beforeEach(() => {
    XMLHttpRequest = {
      open: jest.spyOn(window.XMLHttpRequest.prototype, 'open'),
      send: jest.spyOn(window.XMLHttpRequest.prototype, 'send'),
    };
  });

  afterEach(() => {
    XMLHttpRequest.open.mockClear();
    XMLHttpRequest.send.mockClear();
  });

  describe('with XMLHttpRequest', () => {
    let analyticsInstance: AlgoliaAnalytics;
    let sendBeaconBackup: typeof window.navigator.sendBeacon;
    beforeEach(() => {
      sendBeaconBackup = window.navigator.sendBeacon;
      // @ts-expect-error force usage of XMLHttpRequest
      window.navigator.sendBeacon = undefined;
      analyticsInstance = setupInstance();
    });
    afterEach(() => {
      window.navigator.sendBeacon = sendBeaconBackup;
    });
    it('should make a post request to /1/events', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      expect(XMLHttpRequest.open).toHaveBeenCalledTimes(1);
      const [verb, requestUrl] = XMLHttpRequest.open.mock.calls[0];
      expect(verb).toBe('POST');
      expect(new URL(requestUrl).pathname).toBe('/1/events');
    });
    it('should pass over the payload with multiple events', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            eventType: 'click',
          }),
        ],
      });
    });
    it('should include X-Algolia-* query parameters', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      const requestUrl = XMLHttpRequest.open.mock.calls[0][1];
      const params = new URLSearchParams(new URL(requestUrl).search);
      expect(params.get('X-Algolia-API-Key')).toBe('testKey');
      expect(params.get('X-Algolia-Agent')).toEqual(
        `insights-js (${version}); insights-js-browser-cjs (${version})`
      );
      expect(params.get('X-Algolia-Application-Id')).toBe('testId');
    });
  });

  describe('with sendBeacon', () => {
    let analyticsInstance: AlgoliaAnalytics;
    let sendBeacon: typeof window.navigator.sendBeacon;
    let sendBeaconBackup: typeof window.navigator.sendBeacon;
    beforeEach(() => {
      sendBeaconBackup = window.navigator.sendBeacon;
      sendBeacon = jest
        .spyOn(window.navigator, 'sendBeacon')
        .mockImplementation(() => true);
      analyticsInstance = setupInstance();
    });
    afterEach(() => {
      window.navigator.sendBeacon = sendBeaconBackup;
    });
    it('should use sendBeacon when available', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      expect(sendBeacon).toHaveBeenCalledTimes(1);
      expect(XMLHttpRequest.open).not.toHaveBeenCalled();
      expect(XMLHttpRequest.send).not.toHaveBeenCalled();
    });
    it('should call sendBeacon with /1/event', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      const [requestURL] = sendBeacon.mock.calls[0];

      expect(new URL(requestURL).pathname).toBe('/1/events');
    });
    it('should send the correct payload', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      const payload = JSON.parse(sendBeacon.mock.calls[0][1]);

      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            eventType: 'click',
          }),
        ],
      });
    });
    it('should include X-Algolia-* query parameters', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      const requestUrl = sendBeacon.mock.calls[0][0];
      const params = new URLSearchParams(new URL(requestUrl).search);
      expect(params.get('X-Algolia-API-Key')).toBe('testKey');
      expect(params.get('X-Algolia-Agent')).toEqual(
        `insights-js (${version}); insights-js-browser-cjs (${version})`
      );
      expect(params.get('X-Algolia-Application-Id')).toBe('testId');
    });
  });

  describe('with custom requestFn', () => {
    let analyticsInstance: AlgoliaAnalytics;
    const fakeRequestFn = jest.fn();

    beforeEach(() => {
      fakeRequestFn.mockClear();
      analyticsInstance = setupInstance(fakeRequestFn);
    });
    it('should call the requestFn with expected arguments', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);

      expect(fakeRequestFn).toHaveBeenCalledWith(
        `https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(${version})%3B%20insights-js-browser-cjs%20(${version})`,
        {
          events: [
            {
              eventName: 'my-event',
              eventType: 'click',
              index: 'my-index',
              objectIDs: ['1'],
              userToken: 'mock-user-id',
            },
          ],
        }
      );
    });

    it('should allow a promise to be returned from requestFn', async () => {
      fakeRequestFn.mockImplementationOnce(() => Promise.resolve('test'));

      const result = analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);

      expect(result instanceof Promise).toBe(true);
      await expect(result).resolves.toBe('test');
    });
  });

  describe('init', () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it('should throw if init was not called', () => {
      expect(() => {
        analyticsInstance._hasCredentials = false;
        analyticsInstance.sendEvents();
      }).toThrow(
        "Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters"
      );
    });
    it('should do nothing is _userHasOptedOut === true', () => {
      analyticsInstance._userHasOptedOut = true;
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(0);
    });
  });

  describe('objectIDs and positions', () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it('should support multiple objectIDs and positions', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1', '2'],
          positions: [3, 5],
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            objectIDs: ['1', '2'],
            positions: [3, 5],
          }),
        ],
      });
    });
  });

  describe('timestamp', () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it('should not add a timestamp if not provided', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload.events[0]).not.toHaveProperty('timestamp');
    });
    it('should pass over provided timestamp', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
          timestamp: 1984,
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            timestamp: 1984,
          }),
        ],
      });
    });
  });

  describe('userToken', () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it('should add a userToken if not provided', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            userToken: 'mock-user-id',
          }),
        ],
      });
    });
    it('should pass over provided userToken', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
          userToken: '007',
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            userToken: '007',
          }),
        ],
      });
    });
  });

  describe('filters', () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it('should pass over provided filters', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          filters: ['brand:Apple'],
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            filters: ['brand%3AApple'],
          }),
        ],
      });
    });

    it('should uri-encodes filters', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          filters: ['brand:Cool Brand'],
        },
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            filters: ['brand%3ACool%20Brand'],
          }),
        ],
      });
    });
  });

  describe('multiple events', () => {
    let analyticsInstance: AlgoliaAnalytics;
    const fakeRequestFn = jest.fn();

    beforeEach(() => {
      fakeRequestFn.mockClear();
      analyticsInstance = setupInstance(fakeRequestFn);
    });

    it('should send multiple events via clickedObjectIDs', () => {
      analyticsInstance.clickedObjectIDs(
        {
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
        {
          eventName: 'my-event-2',
          index: 'my-index-2',
          objectIDs: ['2'],
        }
      );

      expect(fakeRequestFn).toHaveBeenCalledWith(
        `https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(${version})%3B%20insights-js-browser-cjs%20(${version})`,
        {
          events: [
            {
              eventName: 'my-event',
              eventType: 'click',
              index: 'my-index',
              objectIDs: ['1'],
              userToken: 'mock-user-id',
            },
            {
              eventName: 'my-event-2',
              eventType: 'click',
              index: 'my-index-2',
              objectIDs: ['2'],
              userToken: 'mock-user-id',
            },
          ],
        }
      );
    });

    it('should send multiple events via sendEvents', () => {
      analyticsInstance.sendEvents([
        {
          eventType: 'click',
          eventName: 'my-event',
          index: 'my-index',
          objectIDs: ['1'],
        },
        {
          eventType: 'click',
          eventName: 'my-event-2',
          index: 'my-index-2',
          objectIDs: ['2'],
        },
      ]);

      expect(fakeRequestFn).toHaveBeenCalledWith(
        `https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(${version})%3B%20insights-js-browser-cjs%20(${version})`,
        {
          events: [
            {
              eventName: 'my-event',
              eventType: 'click',
              index: 'my-index',
              objectIDs: ['1'],
              userToken: 'mock-user-id',
            },
            {
              eventName: 'my-event-2',
              eventType: 'click',
              index: 'my-index-2',
              objectIDs: ['2'],
              userToken: 'mock-user-id',
            },
          ],
        }
      );
    });
  });
});

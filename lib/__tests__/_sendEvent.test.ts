import * as querystring from "querystring";
import * as url from "url";

import AlgoliaAnalytics from "../insights";
import { getRequesterForBrowser } from "../utils/getRequesterForBrowser";

jest.mock("../../package.json", () => ({
  version: "1.0.1"
}));

const credentials = {
  apiKey: "testKey",
  appId: "testId"
};

function setupInstance({
  requestFn = getRequesterForBrowser(),
  init = true
} = {}): AlgoliaAnalytics {
  const instance = new AlgoliaAnalytics({ requestFn });
  if (init) instance.init(credentials);
  instance.setUserToken("mock-user-id");
  return instance;
}

describe("sendEvents", () => {
  let XMLHttpRequest: { open: any; send: any };

  beforeEach(() => {
    XMLHttpRequest = {
      open: jest.spyOn((window as any).XMLHttpRequest.prototype, "open"),
      send: jest.spyOn((window as any).XMLHttpRequest.prototype, "send")
    };
  });

  afterEach(() => {
    XMLHttpRequest.open.mockClear();
    XMLHttpRequest.send.mockClear();
  });

  describe("with XMLHttpRequest", () => {
    let analyticsInstance: AlgoliaAnalytics;
    let sendBeaconBackup: any;
    beforeEach(() => {
      sendBeaconBackup = window.navigator.sendBeacon;
      // @ts-expect-error
      window.navigator.sendBeacon = undefined; // force usage of XMLHttpRequest
      analyticsInstance = setupInstance();
    });
    afterEach(() => {
      window.navigator.sendBeacon = sendBeaconBackup;
    });
    it("should make a post request to /1/events", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      expect(XMLHttpRequest.open).toHaveBeenCalledTimes(1);
      const [verb, requestUrl] = XMLHttpRequest.open.mock.calls[0];
      expect(verb).toBe("POST");
      expect(url.parse(requestUrl).pathname).toBe("/1/events");
    });
    it("should pass over the payload with multiple events", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            eventType: "click"
          })
        ]
      });
    });
    it("should include X-Algolia-* query parameters", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      const requestUrl = XMLHttpRequest.open.mock.calls[0][1];
      const { query } = url.parse(requestUrl);
      expect(querystring.parse(query!)).toEqual({
        "X-Algolia-API-Key": "testKey",
        "X-Algolia-Agent": "insights-js (1.0.1); insights-js-node-cjs (1.0.1)",
        "X-Algolia-Application-Id": "testId"
      });
    });
  });

  describe("with sendBeacon", () => {
    let analyticsInstance: AlgoliaAnalytics;
    let sendBeacon: jest.Mock<any, any>;
    let sendBeaconBackup: any;
    beforeEach(() => {
      sendBeaconBackup = window.navigator.sendBeacon;
      // eslint-disable-next-line no-multi-assign
      sendBeacon = window.navigator.sendBeacon = jest.fn(() => true);
      analyticsInstance = setupInstance();
    });
    afterEach(() => {
      window.navigator.sendBeacon = sendBeaconBackup;
    });
    it("should use sendBeacon when available", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      expect(sendBeacon).toHaveBeenCalledTimes(1);
      expect(XMLHttpRequest.open).not.toHaveBeenCalled();
      expect(XMLHttpRequest.send).not.toHaveBeenCalled();
    });
    it("should call sendBeacon with /1/event", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      const [requestURL] = sendBeacon.mock.calls[0];

      expect(url.parse(requestURL).pathname).toBe("/1/events");
    });
    it("should send the correct payload", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      const payload = JSON.parse(sendBeacon.mock.calls[0][1]);

      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            eventType: "click"
          })
        ]
      });
    });
    it("should include X-Algolia-* query parameters", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      const requestUrl = sendBeacon.mock.calls[0][0];
      const { query } = url.parse(requestUrl);
      expect(querystring.parse(query!)).toEqual({
        "X-Algolia-API-Key": "testKey",
        "X-Algolia-Agent": "insights-js (1.0.1); insights-js-node-cjs (1.0.1)",
        "X-Algolia-Application-Id": "testId"
      });
    });
  });

  describe("with custom requestFn", () => {
    let analyticsInstance: AlgoliaAnalytics;
    const fakeRequestFn = jest.fn().mockResolvedValue(true);

    beforeEach(() => {
      fakeRequestFn.mockClear();
      analyticsInstance = setupInstance({ requestFn: fakeRequestFn });
    });
    it("should call the requestFn with expected arguments", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);

      expect(fakeRequestFn).toHaveBeenCalledWith(
        "https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(1.0.1)%3B%20insights-js-node-cjs%20(1.0.1)",
        {
          events: [
            {
              eventName: "my-event",
              eventType: "click",
              index: "my-index",
              objectIDs: ["1"],
              userToken: "mock-user-id"
            }
          ]
        }
      );
    });

    it("should allow a promise to be returned from requestFn", () => {
      fakeRequestFn.mockImplementationOnce(() => Promise.resolve("test"));

      const result = analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);

      expect(result instanceof Promise).toBe(true);
      expect(result).resolves.toBe("test");
    });
  });

  describe("init", () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should do nothing is _userHasOptedOut === true", () => {
      analyticsInstance._userHasOptedOut = true;
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(0);
    });

    it("applies constructor default values when `init` is not called", () => {
      const customAppId = "overrideTestId";
      const customApiKey = "overrideTestKey";

      analyticsInstance = setupInstance({ init: false });
      analyticsInstance.sendEvents(
        [
          {
            eventType: "click",
            eventName: "my-event",
            index: "my-index",
            objectIDs: ["1"]
          }
        ],
        {
          headers: {
            "X-Algolia-Application-Id": customAppId,
            "X-Algolia-API-Key": customApiKey
          }
        }
      );

      expect(analyticsInstance._endpointOrigin).toBe(
        "https://insights.algolia.io"
      );
      expect(analyticsInstance._userHasOptedOut).toBe(false);
    });
  });

  describe("objectIDs and positions", () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should support multiple objectIDs and positions", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1", "2"],
          positions: [3, 5]
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            objectIDs: ["1", "2"],
            positions: [3, 5]
          })
        ]
      });
    });
  });

  describe("timestamp", () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should not add a timestamp if not provided", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload.events[0]).not.toHaveProperty("timestamp");
    });
    it("should pass over provided timestamp", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"],
          timestamp: 1984
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            timestamp: 1984
          })
        ]
      });
    });
  });

  describe("customer-defined userToken", () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should add a userToken if not provided", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            userToken: "mock-user-id"
          })
        ]
      });
    });
    it("should pass over provided userToken", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"],
          userToken: "007"
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            userToken: "007"
          })
        ]
      });
    });
  });

  describe("in-memory userToken", () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = new AlgoliaAnalytics({
        requestFn: getRequesterForBrowser()
      });
    });

    it("should be added by default", () => {
      expect(analyticsInstance._anonymousUserToken).toBe(true);

      analyticsInstance.sendEvents(
        [
          {
            eventType: "click",
            eventName: "my-event",
            index: "my-index",
            objectIDs: ["1"]
          }
        ],
        {
          headers: {
            "X-Algolia-Application-Id": "algoliaAppId",
            "X-Algolia-API-Key": "algoliaApiKey"
          }
        }
      );
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            userToken: expect.stringMatching(/^anonymous-/)
          })
        ]
      });
    });

    it("should not be added if anonymousUserToken: false", () => {
      analyticsInstance.init({ anonymousUserToken: false });
      expect(analyticsInstance._anonymousUserToken).toBe(false);

      analyticsInstance.sendEvents(
        [
          {
            eventType: "click",
            eventName: "my-event",
            index: "my-index",
            objectIDs: ["1"]
          }
        ],
        {
          headers: {
            "X-Algolia-Application-Id": "algoliaAppId",
            "X-Algolia-API-Key": "algoliaApiKey"
          }
        }
      );
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.not.objectContaining({
            userToken: expect.any(String)
          })
        ]
      });
    });

    it("should not be added if a token is already set", () => {
      analyticsInstance.setUserToken("my-user-token");

      analyticsInstance.sendEvents(
        [
          {
            eventType: "click",
            eventName: "my-event",
            index: "my-index",
            objectIDs: ["1"]
          }
        ],
        {
          headers: {
            "X-Algolia-Application-Id": "algoliaAppId",
            "X-Algolia-API-Key": "algoliaApiKey"
          }
        }
      );
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            userToken: "my-user-token"
          })
        ]
      });
    });
  });

  describe("filters", () => {
    let analyticsInstance: AlgoliaAnalytics;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should pass over provided filters", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          filters: ["brand:Apple"]
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            filters: ["brand%3AApple"]
          })
        ]
      });
    });

    it("should uri-encodes filters", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          filters: ["brand:Cool Brand"]
        }
      ]);
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            filters: ["brand%3ACool%20Brand"]
          })
        ]
      });
    });
  });

  describe("multiple events", () => {
    let analyticsInstance: AlgoliaAnalytics;
    const fakeRequestFn = jest.fn().mockResolvedValue(true);

    beforeEach(() => {
      fakeRequestFn.mockClear();
      analyticsInstance = setupInstance({ requestFn: fakeRequestFn });
    });

    it("should send multiple events via clickedObjectIDs", () => {
      analyticsInstance.clickedObjectIDs(
        {
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        },
        {
          eventName: "my-event-2",
          index: "my-index-2",
          objectIDs: ["2"]
        }
      );

      expect(fakeRequestFn).toHaveBeenCalledWith(
        "https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(1.0.1)%3B%20insights-js-node-cjs%20(1.0.1)",
        {
          events: [
            {
              eventName: "my-event",
              eventType: "click",
              index: "my-index",
              objectIDs: ["1"],
              userToken: "mock-user-id"
            },
            {
              eventName: "my-event-2",
              eventType: "click",
              index: "my-index-2",
              objectIDs: ["2"],
              userToken: "mock-user-id"
            }
          ]
        }
      );
    });

    it("should send multiple events via sendEvents", () => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        },
        {
          eventType: "click",
          eventName: "my-event-2",
          index: "my-index-2",
          objectIDs: ["2"]
        }
      ]);

      expect(fakeRequestFn).toHaveBeenCalledWith(
        "https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(1.0.1)%3B%20insights-js-node-cjs%20(1.0.1)",
        {
          events: [
            {
              eventName: "my-event",
              eventType: "click",
              index: "my-index",
              objectIDs: ["1"],
              userToken: "mock-user-id"
            },
            {
              eventName: "my-event-2",
              eventType: "click",
              index: "my-index-2",
              objectIDs: ["2"],
              userToken: "mock-user-id"
            }
          ]
        }
      );
    });
  });

  it("applies default credentials when no custom ones are provided", () => {
    const analyticsInstance = setupInstance();

    analyticsInstance.sendEvents([
      {
        eventType: "click",
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      }
    ]);

    {
      const requestUrl = XMLHttpRequest.open.mock.calls[0][1];
      const { query } = url.parse(requestUrl);
      expect(querystring.parse(query!)).toMatchObject(
        expect.objectContaining({
          "X-Algolia-Application-Id": credentials.appId,
          "X-Algolia-API-Key": credentials.apiKey
        })
      );
    }
  });

  it("applies custom credentials when provided", () => {
    const analyticsInstance = setupInstance();

    const customAppId = "overrideTestId";
    const customApiKey = "overrideTestKey";

    analyticsInstance.sendEvents(
      [
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ],
      {
        headers: {
          "X-Algolia-Application-Id": customAppId,
          "X-Algolia-API-Key": customApiKey
        }
      }
    );

    {
      const requestUrl = XMLHttpRequest.open.mock.calls[0][1];
      const { query } = url.parse(requestUrl);
      expect(querystring.parse(query!)).toMatchObject(
        expect.objectContaining({
          "X-Algolia-Application-Id": customAppId,
          "X-Algolia-API-Key": customApiKey
        })
      );
    }

    // Subsequent calls should use the original credentials
    analyticsInstance.sendEvents([
      {
        eventType: "click",
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      }
    ]);

    {
      const requestUrl = XMLHttpRequest.open.mock.calls[1][1];
      const { query } = url.parse(requestUrl);
      expect(querystring.parse(query!)).toMatchObject(
        expect.objectContaining({
          "X-Algolia-Application-Id": credentials.appId,
          "X-Algolia-API-Key": credentials.apiKey
        })
      );
    }
  });

  it("should throw if no default or custom credentials are provided", () => {
    const analyticsInstance = setupInstance({ init: false });

    expect(() => {
      analyticsInstance.sendEvents([
        {
          eventType: "click",
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1"]
        }
      ]);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters or provide custom credentials in additional parameters."`
    );
  });
});

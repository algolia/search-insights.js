import AlgoliaAnalytics from "../insights";
import { getRequesterForBrowser } from "../utils/getRequesterForBrowser";
import * as url from "url";
import * as querystring from "querystring";

jest.mock("../../package.json", () => ({
  version: "1.0.1"
}));

const credentials = {
  apiKey: "testKey",
  appId: "testId"
};

function setupInstance(requestFn = getRequesterForBrowser()) {
  const instance = new AlgoliaAnalytics({ requestFn });
  instance.init(credentials);
  instance.setUserToken("mock-user-id");
  return instance;
}

describe("sendEvent", () => {
  let XMLHttpRequest;

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
    let analyticsInstance;
    let sendBeaconBackup;
    beforeEach(() => {
      sendBeaconBackup = window.navigator.sendBeacon;
      window.navigator.sendBeacon = undefined; // force usage of XMLHttpRequest
      analyticsInstance = setupInstance();
    });
    afterEach(() => {
      window.navigator.sendBeacon = sendBeaconBackup;
    });
    it("should make a post request to /1/events", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      expect(XMLHttpRequest.open).toHaveBeenCalledTimes(1);
      const [verb, requestUrl] = XMLHttpRequest.open.mock.calls[0];
      expect(verb).toBe("POST");
      expect(url.parse(requestUrl).pathname).toBe("/1/events");
    });
    it("should pass over the payload with multiple events", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
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
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      const requestUrl = XMLHttpRequest.open.mock.calls[0][1];
      const { query } = url.parse(requestUrl);
      expect(querystring.parse(query)).toEqual({
        "X-Algolia-API-Key": "testKey",
        "X-Algolia-Agent": "insights-js (1.0.1)",
        "X-Algolia-Application-Id": "testId"
      });
    });
  });

  describe("with sendBeacon", () => {
    let analyticsInstance;
    let sendBeacon;
    let sendBeaconBackup;
    beforeEach(() => {
      sendBeaconBackup = window.navigator.sendBeacon;
      sendBeacon = window.navigator.sendBeacon = jest.fn();
      analyticsInstance = setupInstance();
    });
    afterEach(() => {
      window.navigator.sendBeacon = sendBeaconBackup;
    });
    it("should use sendBeacon when available", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      expect(sendBeacon).toHaveBeenCalledTimes(1);
      expect(XMLHttpRequest.open).not.toHaveBeenCalled();
      expect(XMLHttpRequest.send).not.toHaveBeenCalled();
    });
    it("should call sendBeacon with /1/event", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      const [requestURL] = sendBeacon.mock.calls[0];

      expect(url.parse(requestURL).pathname).toBe("/1/events");
    });
    it("should send the correct payload", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
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
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      const requestUrl = sendBeacon.mock.calls[0][0];
      const { query } = url.parse(requestUrl);
      expect(querystring.parse(query)).toEqual({
        "X-Algolia-API-Key": "testKey",
        "X-Algolia-Agent": "insights-js (1.0.1)",
        "X-Algolia-Application-Id": "testId"
      });
    });
  });

  describe("with custom requestFn", () => {
    let analyticsInstance;
    const fakeRequestFn = jest.fn();

    beforeEach(() => {
      fakeRequestFn.mockClear();
      analyticsInstance = setupInstance(fakeRequestFn);
    });
    it("should call the requestFn with expected arguments", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });

      expect(fakeRequestFn).toHaveBeenCalledWith(
        "https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(1.0.1)",
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

      const result = (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });

      expect(result instanceof Promise).toBe(true);
      expect(result).resolves.toBe("test");
    });
  });

  describe("init", () => {
    let analyticsInstance;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should throw if init was not called", () => {
      expect(() => {
        (analyticsInstance as any)._hasCredentials = false;
        (analyticsInstance as any).sendEvent();
      }).toThrowError(
        "Before calling any methods on the analytics, you first need to call the 'init' function with appId and apiKey parameters"
      );
    });
    it("should do nothing is _userHasOptedOut === true", () => {
      analyticsInstance._userHasOptedOut = true;
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(0);
    });
  });

  describe("eventName", () => {
    let analyticsInstance;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should throw if no eventName passed", () => {
      expect(() => {
        (analyticsInstance as any).sendEvent("click", {
          index: "my-index",
          objectIDs: ["1"]
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`eventName\` to be a string"`
      );
    });
    it("should throw if eventName is not a string", () => {
      expect(() => {
        (analyticsInstance as any).sendEvent("click", {
          eventName: 3,
          index: "my-index",
          objectIDs: ["1"]
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`eventName\` to be a string"`
      );
    });
  });

  describe("index", () => {
    let analyticsInstance;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should throw if no index passed", () => {
      expect(() => {
        (analyticsInstance as any).sendEvent("click", {
          eventName: "my-event"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`index\` to be a string"`
      );
    });
    it("should throw if no index is not a string", () => {
      expect(() => {
        (analyticsInstance as any).sendEvent("click", {
          eventName: "my-event",
          index: 2
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`index\` to be a string"`
      );
    });
  });

  describe("objectIDs and positions", () => {
    let analyticsInstance;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should support multiple objectIDs and positions", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1", "2"],
        positions: [3, 5]
      });
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
    it("should throw and error when objectIDs and positions are not the same size", () => {
      expect(() => {
        (analyticsInstance as any).sendEvent("click", {
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1", "2"],
          positions: [3]
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"objectIDs and positions need to be of the same size"`
      );
    });
    it("should throw and error when positions supplied but not objectIDs", () => {
      expect(() => {
        (analyticsInstance as any).sendEvent("click", {
          eventName: "my-event",
          index: "my-index",
          positions: [3]
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"cannot use \`positions\` without providing \`objectIDs\`"`
      );
    });
  });

  describe("timestamp", () => {
    let analyticsInstance;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should not add a timestamp if not provided", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload.events[0]).not.toHaveProperty("timestamp");
    });
    it("should pass over provided timestamp", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"],
        timestamp: 1984
      });
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

  describe("userToken", () => {
    let analyticsInstance;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should add a userToken if not provided", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
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
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"],
        userToken: "007"
      });
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

  describe("filters", () => {
    let analyticsInstance;
    beforeEach(() => {
      analyticsInstance = setupInstance();
    });

    it("should pass over provided filters", () => {
      (analyticsInstance as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        filters: ["brand:Apple"]
      });
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            filters: ["brand:Apple"]
          })
        ]
      });
    });
    it("should throw and error when objectIDs and filter are both provided", () => {
      expect(() => {
        (analyticsInstance as any).sendEvent("click", {
          eventName: "my-event",
          index: "my-index",
          objectIDs: ["1", "2"],
          filters: ["brand:Apple"]
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"cannot use \`objectIDs\` and \`filters\` for the same event"`
      );
    });
    it("should throw and error when neither objectIDs or filters are provided", () => {
      expect(() => {
        (analyticsInstance as any).sendEvent("click", {
          eventName: "my-event",
          index: "my-index"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected either \`objectIDs\` or \`filters\` to be provided"`
      );
    });
  });
});

import AlgoliaInsights from "../insights";
import * as url from "url";

jest.mock("../_cookieUtils", () => ({
  userToken: jest.fn(() => "mock-user-id")
}));

const credentials = {
  apiKey: "test",
  applicationID: "test"
};

describe("sendEvent", () => {
  let XMLHttpRequest;

  beforeEach(() => {
    AlgoliaInsights.init(credentials);
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
    beforeEach(() => {
      window.navigator.sendBeacon = undefined; // force usage of XMLHttpRequest
    });
    it("should make a post request to /1/events", () => {
      (AlgoliaInsights as any).sendEvent("click", {
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
      (AlgoliaInsights as any).sendEvent("click", {
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
  });

  describe("with sendBeacon", () => {
    let sendBeacon;
    beforeEach(() => {
      sendBeacon = window.navigator.sendBeacon = jest.fn();
    });
    afterEach(() => {
      window.navigator.sendBeacon = undefined;
    });
    it("should use sendBeacon when available", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      expect(sendBeacon).toHaveBeenCalledTimes(1);
      expect(XMLHttpRequest.open).not.toHaveBeenCalled();
      expect(XMLHttpRequest.send).not.toHaveBeenCalled();
    });
    it("should call sendBeacon with /1/event", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      const [requestURL] = sendBeacon.mock.calls[0];

      expect(url.parse(requestURL).pathname).toBe("/1/events");
    });
    it("should send the correct payload", () => {
      (AlgoliaInsights as any).sendEvent("click", {
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
  });

  describe("init", () => {
    it("should throw if init was not called", () => {
      expect(() => {
        (AlgoliaInsights as any)._hasCredentials = false;
        (AlgoliaInsights as any).sendEvent();
      }).toThrowError(
        "Before calling any methods on the analytics, you first need to call the 'init' function with applicationID and apiKey parameters"
      );
    });
  });

  describe("eventName", () => {
    it("should throw if no eventName passed", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          index: "my-index"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`eventName\` to be a string"`
      );
    });
    it("should throw if eventName is not a string", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: 3,
          index: "my-index"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`eventName\` to be a string"`
      );
    });
  });

  describe("index", () => {
    it("should throw if no index passed", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: "my-event"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`index\` to be a string"`
      );
    });
    it("should throw if no index is not a string", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: "my-event",
          index: 2
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`index\` to be a string"`
      );
    });
  });

  describe("objectIDs and positions", () => {
    it("should support multiple objectIDs and positions", () => {
      (AlgoliaInsights as any).sendEvent("click", {
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
        (AlgoliaInsights as any).sendEvent("click", {
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
        (AlgoliaInsights as any).sendEvent("click", {
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
    it("should add a timestamp if not provided", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            timestamp: expect.any(Number)
          })
        ]
      });
    });
    it("should pass over provided timestamp", () => {
      (AlgoliaInsights as any).sendEvent("click", {
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
    it("should add a userToken if not provided", () => {
      (AlgoliaInsights as any).sendEvent("click", {
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
      (AlgoliaInsights as any).sendEvent("click", {
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
    it("should pass over provided filters", () => {
      (AlgoliaInsights as any).sendEvent("click", {
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
        (AlgoliaInsights as any).sendEvent("click", {
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
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: "my-event",
          index: "my-index"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected either \`objectIDs\` or \`filters\` to be provided"`
      );
    });
  });
});

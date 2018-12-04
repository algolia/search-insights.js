import AlgoliaInsights from "../insights";
import * as url from "url";

jest.mock("../_cookieUtils", () => ({
  userID: jest.fn(() => "mock-user-id")
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
        indexName: "my-index"
      });
      expect(XMLHttpRequest.open).toHaveBeenCalledTimes(1);
      const [verb, requestUrl] = XMLHttpRequest.open.mock.calls[0];
      expect(verb).toBe("POST");
      expect(url.parse(requestUrl).pathname).toBe("/1/events");
    });
    it("should pass over the payload with multiple events", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        indexName: "my-index"
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
        indexName: "my-index"
      });
      expect(sendBeacon).toHaveBeenCalledTimes(1);
      expect(XMLHttpRequest.open).not.toHaveBeenCalled();
      expect(XMLHttpRequest.send).not.toHaveBeenCalled();
    });
    it("should call sendBeacon with /1/event", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        indexName: "my-index"
      });
      const [requestURL] = sendBeacon.mock.calls[0];

      expect(url.parse(requestURL).pathname).toBe("/1/events");
    });
    it("should send the correct payload", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        indexName: "my-index"
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

  describe("eventName", () => {
    it("should throw if no eventName passed", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          indexName: "my-index"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`eventName\` to be a string"`
      );
    });
    it("should throw if no eventName passed", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: 3,
          indexName: "my-index"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`eventName\` to be a string"`
      );
    });
  });

  describe("indexName", () => {
    it("should throw if no indexName passed", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: "my-event"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`indexName\` to be a string"`
      );
    });
    it("should throw if no indexName is not a string", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: "my-event",
          indexName: 2
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"expected required parameter \`indexName\` to be a string"`
      );
    });
  });

  describe("objectID and position", () => {
    it("should support multiple objectID and position", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        indexName: "my-index",
        objectID: ["1", "2"],
        position: [3, 5]
      });
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            objectID: ["1", "2"],
            position: [3, 5]
          })
        ]
      });
    });
    it("should throw and error when objectID and position are not the same size", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: "my-event",
          indexName: "my-index",
          objectID: ["1", "2"],
          position: [3]
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"objectID and position need to be of the same size"`
      );
    });
    it("should throw and error when positions supplied but not objectID", () => {
      expect(() => {
        (AlgoliaInsights as any).sendEvent("click", {
          eventName: "my-event",
          indexName: "my-index",
          position: [3]
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Cannot use \`position\` without providing \`objectID\`"`
      );
    });
  });

  describe("timestamp", () => {
    it("should add a timestamp if not provided", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        indexName: "my-index"
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
        indexName: "my-index",
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

  describe("userID", () => {
    it("should add a userID if not provided", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        indexName: "my-index"
      });
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            userID: "mock-user-id"
          })
        ]
      });
    });
    it("should pass over provided userID", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        indexName: "my-index",
        userID: "007"
      });
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            userID: "007"
          })
        ]
      });
    });
  });
});

import AlgoliaInsights from "../insights";
import * as url from "url";

jest.mock("../_cookieUtils", () => ({
  userID: jest.fn(() => "42")
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
        objectID: "1"
      });
      expect(XMLHttpRequest.open).toHaveBeenCalledTimes(1);
      const [verb, requestUrl] = XMLHttpRequest.open.mock.calls[0];
      expect(verb).toBe("POST");
      expect(url.parse(requestUrl).pathname).toBe("/1/events");
    });
    it("should pass over the payload with multiple events", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        objectID: "1"
      });
      expect(XMLHttpRequest.send).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(XMLHttpRequest.send.mock.calls[0][0]);
      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            eventType: "click",
            objectID: "1",
            userID: "42",
            timestamp: expect.any(Number)
          })
        ]
      });
    });
  });

  describe("with sendBeacon", function() {
    let sendBeacon;
    beforeEach(() => {
      sendBeacon = window.navigator.sendBeacon = jest.fn();
    });
    afterEach(() => {
      window.navigator.sendBeacon = undefined;
    });
    it("should use sendBeacon when available", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        objectID: "1"
      });
      expect(sendBeacon).toHaveBeenCalledTimes(1);
      expect(XMLHttpRequest.open).not.toHaveBeenCalled();
      expect(XMLHttpRequest.send).not.toHaveBeenCalled();
    });
    it("should call sendBeacon with /1/event", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        objectID: "1"
      });
      const [requestURL] = sendBeacon.mock.calls[0];

      expect(url.parse(requestURL).pathname).toBe("/1/events");
    });
    it("should send the correct payload", () => {
      (AlgoliaInsights as any).sendEvent("click", {
        objectID: "1"
      });
      const payload = JSON.parse(sendBeacon.mock.calls[0][1]);

      expect(payload).toEqual({
        events: [
          expect.objectContaining({
            eventType: "click",
            objectID: "1",
            userID: "42",
            timestamp: expect.any(Number)
          })
        ]
      });
    });
  });
});

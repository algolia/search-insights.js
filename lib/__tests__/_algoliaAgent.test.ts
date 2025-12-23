import AlgoliaAnalytics from "../insights";
import type { RequestFnType } from "../utils/request";

jest.mock("../../package.json", () => ({ version: "1.0.1" }));

describe("algoliaAgent", () => {
  let analyticsInstance: AlgoliaAnalytics;
  const requestFn: jest.MockedFunction<RequestFnType> = jest.fn();

  beforeEach(() => {
    requestFn.mockResolvedValue(true);
    analyticsInstance = new AlgoliaAnalytics({ requestFn });
    analyticsInstance.init({ apiKey: "test", appId: "test" });
  });

  it("should initialize the client with a default algoliaAgent string", () => {
    expect(analyticsInstance._ua).toEqual([
      "insights-js (1.0.1)",
      "insights-js-node-cjs (1.0.1)"
    ]);
  });

  it("should allow adding a string to algoliaAgent", () => {
    analyticsInstance.addAlgoliaAgent("other string");
    expect(analyticsInstance._ua).toEqual([
      "insights-js (1.0.1)",
      "insights-js-node-cjs (1.0.1)",
      "other string"
    ]);
  });

  it("should duplicate a string when added twice", () => {
    analyticsInstance.addAlgoliaAgent("duplicated string");
    analyticsInstance.addAlgoliaAgent("duplicated string");

    expect(analyticsInstance._ua).toEqual([
      "insights-js (1.0.1)",
      "insights-js-node-cjs (1.0.1)",
      "duplicated string"
    ]);
  });

  it("should be joined and encoded in headers", () => {
    analyticsInstance.addAlgoliaAgent("other string");
    analyticsInstance.sendEvents([
      {
        eventType: "click",
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      }
    ]);

    expect(requestFn.mock.calls[0][0]).toEqual(
      "https://insights.algolia.io/1/events"
    );
    expect(requestFn.mock.calls[0][2]).toEqual(
      expect.objectContaining({
        "X-Algolia-Agent":
          "insights-js%20(1.0.1)%3B%20insights-js-node-cjs%20(1.0.1)%3B%20other%20string"
      })
    );
  });
});

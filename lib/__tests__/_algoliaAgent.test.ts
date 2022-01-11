import { describe, it, beforeEach, expect, vi } from "vitest";
import AlgoliaAnalytics from "../insights";
import { version } from "../_version";

describe("algoliaAgent", () => {
  let analyticsInstance: AlgoliaAnalytics;
  let requestFn = vi.fn();

  beforeEach(() => {
    requestFn.mockReset();
    analyticsInstance = new AlgoliaAnalytics({ requestFn });
    analyticsInstance.init({ apiKey: "test", appId: "test" });
  });

  it("should initialize the client with a default algoliaAgent string", () => {
    expect(analyticsInstance._ua).toEqual([
      `insights-js (${version})`,
      `insights-js-browser-cjs (${version})`
    ]);
  });

  it("should allow adding a string to algoliaAgent", () => {
    analyticsInstance.addAlgoliaAgent("other string");
    expect(analyticsInstance._ua).toEqual([
      `insights-js (${version})`,
      `insights-js-browser-cjs (${version})`,
      "other string"
    ]);
  });

  it("should duplicate a string when added twice", () => {
    analyticsInstance.addAlgoliaAgent("duplicated string");
    analyticsInstance.addAlgoliaAgent("duplicated string");

    expect(analyticsInstance._ua).toEqual([
      `insights-js (${version})`,
      `insights-js-browser-cjs (${version})`,
      "duplicated string"
    ]);
  });

  it("should be joined and encoded for URL", () => {
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
      `https://insights.algolia.io/1/events?X-Algolia-Application-Id=test&X-Algolia-API-Key=test&X-Algolia-Agent=insights-js%20(${version})%3B%20insights-js-browser-cjs%20(${version})%3B%20other%20string`
    );
  });
});

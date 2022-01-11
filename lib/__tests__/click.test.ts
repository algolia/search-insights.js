import { describe, it, beforeEach, expect, vi } from "vitest";
import AlgoliaAnalytics from "../insights";

const credentials = {
  apiKey: "test",
  appId: "test"
};

let analyticsInstance: AlgoliaAnalytics;
beforeEach(() => {
  analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
});

describe("clickedObjectIDsAfterSearch", () => {
  it("should attach eventType", () => {
    const clickParams = {
      positions: [1],
      objectIDs: ["2"],
      queryID: "testing",
      eventName: "testEvent",
      index: "my-index"
    };

    analyticsInstance.init(credentials);
    analyticsInstance.sendEvents = vi.fn();
    analyticsInstance.clickedObjectIDsAfterSearch(clickParams);

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith([
      {
        eventType: "click",
        ...clickParams
      }
    ]);
  });
});

describe("clickedObjectIDs", () => {
  it("should attach eventType", () => {
    const clickParams = {
      objectIDs: ["2"],
      eventName: "testEvent",
      index: "my-index"
    };

    analyticsInstance.init(credentials);
    analyticsInstance.sendEvents = vi.fn();
    analyticsInstance.clickedObjectIDs(clickParams);

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith([
      {
        eventType: "click",
        ...clickParams
      }
    ]);
  });
});

describe("clickedFilters", () => {
  it("should attach eventType", () => {
    const clickParams = {
      filters: ["brands:apple"],
      eventName: "testEvent",
      index: "my-index"
    };

    analyticsInstance.init(credentials);
    analyticsInstance.sendEvents = vi.fn();
    analyticsInstance.clickedFilters(clickParams);

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith([
      {
        eventType: "click",
        ...clickParams
      }
    ]);
  });
});

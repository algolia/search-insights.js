import { describe, it, beforeEach, expect, vi } from "vitest";
import AlgoliaAnalytics from "../insights";

const credentials = {
  apiKey: "test",
  appId: "test"
};
describe("viewedObjectIDs", () => {
  let analyticsInstance: AlgoliaAnalytics;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should attach eventType", () => {
    analyticsInstance.sendEvents = vi.fn();
    analyticsInstance.init(credentials);
    // @ts-expect-error
    analyticsInstance.viewedObjectIDs({
      objectIDs: ["12345"]
    });
    expect(analyticsInstance.sendEvents).toHaveBeenCalled();
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith([
      {
        eventType: "view",
        objectIDs: ["12345"]
      }
    ]);
  });
});

describe("viewedFilters", () => {
  let analyticsInstance: AlgoliaAnalytics;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should attach eventType", () => {
    analyticsInstance.sendEvents = vi.fn();
    analyticsInstance.init(credentials);
    // @ts-expect-error
    analyticsInstance.viewedFilters({
      filters: ["brands:apple"]
    });
    expect(analyticsInstance.sendEvents).toHaveBeenCalled();
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith([
      {
        eventType: "view",
        filters: ["brands:apple"]
      }
    ]);
  });
});

import { jest } from "@jest/globals";
import AlgoliaAnalytics from "../insights";

const credentials = {
  apiKey: "test",
  appId: "test"
};

let analyticsInstance;
beforeEach(() => {
  analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
});

describe("clickedObjectIDsAfterSearch", () => {
  test("Should call sendEvents with proper params", () => {
    const clickParams = {
      positions: [1],
      objectIDs: ["2"],
      queryID: "testing"
    };

    analyticsInstance.init(credentials);
    (analyticsInstance as any).sendEvents = jest.fn();
    analyticsInstance.clickedObjectIDsAfterSearch(clickParams);

    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith([
      {
        eventType: "click",
        ...clickParams
      }
    ]);
  });
});

describe("clickedObjectIDs", () => {
  it("should call sendEvents with proper params", () => {
    const clickParams = {
      objectIDs: ["2"]
    };

    analyticsInstance.init(credentials);
    (analyticsInstance as any).sendEvents = jest.fn();
    analyticsInstance.clickedObjectIDs(clickParams);

    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith([
      {
        eventType: "click",
        ...clickParams
      }
    ]);
  });
});

describe("clickedFilters", () => {
  it("should call sendEvents with proper params", () => {
    const clickParams = {
      filters: ["brands:apple"]
    };

    analyticsInstance.init(credentials);
    (analyticsInstance as any).sendEvents = jest.fn();
    analyticsInstance.clickedFilters(clickParams);

    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith([
      {
        eventType: "click",
        ...clickParams
      }
    ]);
  });
});

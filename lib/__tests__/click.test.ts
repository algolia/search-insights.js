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
  test("Should call sendEvent with proper params", () => {
    const clickParams = {
      positions: [1],
      objectIDs: ["2"],
      queryID: "testing"
    };

    analyticsInstance.init(credentials);
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.clickedObjectIDsAfterSearch(clickParams);

    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams
    );
  });
});

describe("clickedObjectIDs", () => {
  it("should call sendEvent with proper params", () => {
    const clickParams = {
      objectIDs: ["2"]
    };

    analyticsInstance.init(credentials);
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.clickedObjectIDs(clickParams);

    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams
    );
  });
});

describe("clickedFilters", () => {
  it("should call sendEvent with proper params", () => {
    const clickParams = {
      filters: ["brands:apple"]
    };

    analyticsInstance.init(credentials);
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.clickedFilters(clickParams);

    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams
    );
  });
});

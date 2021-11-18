import AlgoliaAnalytics from "../insights";

const credentials = {
  apiKey: "test",
  appId: "test"
};
describe("viewedObjectIDs", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvents = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.viewedObjectIDs({
      objectIDs: ["12345"]
    });
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith([
      {
        eventType: "view",
        objectIDs: ["12345"]
      }
    ]);
  });
});

describe("viewedFilters", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvents = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.viewedFilters({
      filters: ["brands:apple"]
    });
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith([
      {
        eventType: "view",
        filters: ["brands:apple"]
      }
    ]);
  });
});

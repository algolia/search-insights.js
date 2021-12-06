import AlgoliaAnalytics from "../insights";

const credentials = {
  apiKey: "test",
  appId: "test"
};
describe("convertedObjectIDsAfterSearch", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("Should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvents = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedObjectIDsAfterSearch({
      objectIDs: ["12345"],
      queryID: "test"
    });
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith([
      {
        eventType: "conversion",
        objectIDs: ["12345"],
        queryID: "test"
      }
    ]);
  });
});

describe("convertedObjectIDs", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvents = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedObjectIDs({
      objectIDs: ["12345"]
    });
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith([
      {
        eventType: "conversion",
        objectIDs: ["12345"]
      }
    ]);
  });
});

describe("convertedFilters", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvents = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedFilters({
      filters: ["brands:apple"]
    });
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith([
      {
        eventType: "conversion",
        filters: ["brands:apple"]
      }
    ]);
  });
});

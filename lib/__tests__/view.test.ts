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

  it("should throw if no params are sent", () => {
    expect(() => {
      analyticsInstance.init(credentials);
      (analyticsInstance as any).viewedObjectIDs();
    }).toThrowError(
      "No params were sent to viewedObjectIDs function, please provide `objectIDs` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);

    expect(() => {
      (analyticsInstance as any).viewedObjectIDs({ queryID: "test" });
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, view event can not be properly sent without"
    );
  });

  it("should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.viewedObjectIDs({
      objectIDs: ["12345"]
    });
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "view",
      {
        objectIDs: ["12345"]
      },
      undefined
    );
  });
});

describe("viewedFilters", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should throw if no params are sent", () => {
    expect(() => {
      analyticsInstance.init(credentials);
      (analyticsInstance as any).viewedFilters();
    }).toThrowError(
      "No params were sent to viewedFilters function, please provide `filters` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);

    expect(() => {
      (analyticsInstance as any).viewedFilters({});
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required filters parameter was not sent, view event can not be properly sent without"
    );
  });

  it("should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.viewedFilters({
      filters: ["brands:apple"]
    });
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "view",
      {
        filters: ["brands:apple"]
      },
      undefined
    );
  });
});

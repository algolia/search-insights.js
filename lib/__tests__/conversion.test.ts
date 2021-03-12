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

  it("Should throw if no params are sent", () => {
    expect(() => {
      analyticsInstance.init(credentials);
      (analyticsInstance as any).convertedObjectIDsAfterSearch();
    }).toThrowError(
      "No params were sent to convertedObjectIDsAfterSearch function, please provide `queryID` and `objectIDs` to be reported"
    );
  });

  it("Should throw if no queryID has been passed", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);

    expect(() => {
      (analyticsInstance as any).convertedObjectIDsAfterSearch({
        objectIDs: ["12345"]
      });
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required queryID parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("Should throw if no objectIDs has been passed", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);

    expect(() => {
      (analyticsInstance as any).convertedObjectIDsAfterSearch({
        queryID: "test"
      });
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("Should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedObjectIDsAfterSearch({
      objectIDs: ["12345"],
      queryID: "test"
    });
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      { objectIDs: ["12345"], queryID: "test" },
      undefined
    );
  });
});

describe("convertedObjectIDs", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should throw if no params are sent", () => {
    expect(() => {
      analyticsInstance.init(credentials);
      (analyticsInstance as any).convertedObjectIDs();
    }).toThrowError(
      "No params were sent to convertedObjectIDs function, please provide `objectIDs` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);

    expect(() => {
      (analyticsInstance as any).convertedObjectIDs({ queryID: "test" });
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedObjectIDs({
      objectIDs: ["12345"]
    });
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      { objectIDs: ["12345"] },
      undefined
    );
  });
});

describe("convertedFilters", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should throw if no params are sent", () => {
    expect(() => {
      analyticsInstance.init(credentials);
      (analyticsInstance as any).convertedFilters();
    }).toThrowError(
      "No params were sent to convertedFilters function, please provide `filters` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);

    expect(() => {
      (analyticsInstance as any).convertedFilters({});
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required filters parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("should send allow passing of queryID", () => {
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedFilters({
      filters: ["brands:apple"]
    });
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalled();
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      { filters: ["brands:apple"] },
      undefined
    );
  });
});

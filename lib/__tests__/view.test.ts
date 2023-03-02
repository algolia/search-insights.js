import AlgoliaAnalytics from "../insights";

const credentials = {
  apiKey: "test",
  appId: "test"
};

const additionalParameters = {
  headers: {
    "X-Algolia-Application-Id": "overrideApp123",
    "X-Algolia-API-Key": "overrideKey123"
  }
};

let analyticsInstance: AlgoliaAnalytics;
beforeEach(() => {
  analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  (analyticsInstance as any).sendEvent = jest.fn();
  analyticsInstance.init(credentials);
});

describe("viewedObjectIDs", () => {
  it("should throw if no params are sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.viewedObjectIDs();
    }).toThrowError(
      "No params were sent to viewedObjectIDs function, please provide `objectIDs` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.viewedObjectIDs({ queryID: "test" });
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, view event can not be properly sent without"
    );
  });

  const viewParams = {
    index: "index1",
    eventName: "hits viewed",
    objectIDs: ["12345"]
  };

  it("should call sendEvent with proper params", () => {
    analyticsInstance.viewedObjectIDs(viewParams);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "view",
      viewParams,
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.viewedObjectIDs(viewParams, additionalParameters);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "view",
      viewParams,
      additionalParameters
    );
  });
});

describe("viewedFilters", () => {
  it("should throw if no params are sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.viewedFilters();
    }).toThrowError(
      "No params were sent to viewedFilters function, please provide `filters` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.viewedFilters({});
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required filters parameter was not sent, view event can not be properly sent without"
    );
  });

  const viewParams = {
    index: "index1",
    eventName: "filters viewed",
    filters: ["brands:apple"]
  };

  it("should call sendEvent with proper params", () => {
    analyticsInstance.viewedFilters(viewParams);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "view",
      viewParams,
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.viewedFilters(viewParams, additionalParameters);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "view",
      viewParams,
      additionalParameters
    );
  });
});

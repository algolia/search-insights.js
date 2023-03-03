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

describe("convertedObjectIDsAfterSearch", () => {
  it("should throw if no params are sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.convertedObjectIDsAfterSearch();
    }).toThrowError(
      "No params were sent to convertedObjectIDsAfterSearch function, please provide `queryID` and `objectIDs` to be reported"
    );
  });

  it("should throw if no queryID has been passed", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.convertedObjectIDsAfterSearch({
        objectIDs: ["12345"]
      });
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required queryID parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.convertedObjectIDsAfterSearch({
        queryID: "test"
      });
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  });

  const conversionParams = {
    index: "index1",
    objectIDs: ["12345"],
    queryID: "test"
  };

  it("should call sendEvent with proper params", () => {
    analyticsInstance.convertedObjectIDsAfterSearch(conversionParams);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      conversionParams,
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.convertedObjectIDsAfterSearch(
      conversionParams,
      additionalParameters
    );
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      conversionParams,
      additionalParameters
    );
  });
});

describe("convertedObjectIDs", () => {
  it("should throw if no params are sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.convertedObjectIDs();
    }).toThrowError(
      "No params were sent to convertedObjectIDs function, please provide `objectIDs` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.convertedObjectIDs({ queryID: "test" });
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  });

  const conversionParams = {
    index: "index1",
    eventName: "hit converted",
    objectIDs: ["12345"]
  };

  it("should call sendEvent with proper params", () => {
    analyticsInstance.convertedObjectIDs(conversionParams);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      conversionParams,
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.convertedObjectIDs(
      conversionParams,
      additionalParameters
    );
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      conversionParams,
      additionalParameters
    );
  });
});

describe("convertedFilters", () => {
  it("should throw if no params are sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.convertedFilters();
    }).toThrowError(
      "No params were sent to convertedFilters function, please provide `filters` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.convertedFilters({});
      expect((analyticsInstance as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required filters parameter was not sent, conversion event can not be properly sent without"
    );
  });

  const conversionParams = {
    index: "index1",
    eventName: "filters converted",
    filters: ["brands:apple"]
  };

  it("should call sendEvent with proper params", () => {
    analyticsInstance.convertedFilters(conversionParams);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      conversionParams,
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.convertedFilters(conversionParams, additionalParameters);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      conversionParams,
      additionalParameters
    );
  });
});

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

describe("clickedObjectIDsAfterSearch", () => {
  test("should throw if queryID, objectIDs or positions are not sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.clickedObjectIDsAfterSearch();
    }).toThrowError(
      "No params were sent to clickedObjectIDsAfterSearch function, please provide `queryID`,  `objectIDs` and `positions` to be reported"
    );
  });

  test("should throw if objectIDs is not sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.clickedObjectIDsAfterSearch({
        queryID: "testing",
        positions: [1]
      });
    }).toThrowError(
      "required objectIDs parameter was not sent, click event can not be properly sent without"
    );
  });

  test("should throw if positions is not sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.clickedObjectIDsAfterSearch({
        queryID: "testing",
        objectIDs: [1]
      });
    }).toThrowError(
      "required positions parameter was not sent, click event can not be properly sent without"
    );
  });

  test("should throw if queryID is not sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.clickedObjectIDsAfterSearch({
        objectIDs: ["1"],
        positions: [1]
      });
    }).toThrowError(
      "required queryID parameter was not sent, click event can not be properly sent without"
    );
  });

  const clickParams = {
    index: "index1",
    positions: [1],
    objectIDs: ["2"],
    queryID: "testing"
  };

  test("should call sendEvent with proper params", () => {
    analyticsInstance.clickedObjectIDsAfterSearch(clickParams);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams,
      undefined
    );
  });

  test("should call sendEvents with additional params if provided", () => {
    analyticsInstance.clickedObjectIDsAfterSearch(
      clickParams,
      additionalParameters
    );
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams,
      additionalParameters
    );
  });
});

describe("clickedObjectIDs", () => {
  it("should throw if no parameters is passed", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.clickedObjectIDs();
    }).toThrowErrorMatchingInlineSnapshot(
      `"No params were sent to clickedObjectIDs function, please provide \`objectIDs\` to be reported"`
    );
  });
  it("should throw if objectIDs is not sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.clickedObjectIDs({});
    }).toThrowErrorMatchingInlineSnapshot(
      `"required \`objectIDs\` parameter was not sent, click event can not be properly sent without"`
    );
  });

  const clickParams = {
    index: "index1",
    eventName: "hit clicked",
    objectIDs: ["2"]
  };

  it("should call sendEvent with proper params", () => {
    analyticsInstance.clickedObjectIDs(clickParams);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams,
      undefined
    );
  });

  test("should call sendEvents with additional params if provided", () => {
    analyticsInstance.clickedObjectIDs(clickParams, additionalParameters);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams,
      additionalParameters
    );
  });
});

describe("clickedFilters", () => {
  it("should throw if no parameters is passed", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.clickedFilters();
    }).toThrowErrorMatchingInlineSnapshot(
      `"No params were sent to clickedFilters function, please provide \`filters\` to be reported"`
    );
  });
  it("should throw if filters is not sent", () => {
    expect(() => {
      // @ts-expect-error
      analyticsInstance.clickedFilters({});
    }).toThrowErrorMatchingInlineSnapshot(
      `"required \`filters\` parameter was not sent, click event can not be properly sent without"`
    );
  });

  const clickParams = {
    index: "index1",
    eventName: "filters clicked",
    filters: ["brands:apple"]
  };

  it("should call sendEvent with proper params", () => {
    analyticsInstance.clickedFilters(clickParams);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams,
      undefined
    );
  });

  test("should call sendEvents with additional params if provided", () => {
    analyticsInstance.clickedFilters(clickParams, additionalParameters);
    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams,
      additionalParameters
    );
  });
});

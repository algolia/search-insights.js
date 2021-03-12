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
  test("Should throw if queryID, objectIDs or positions are not sent", () => {
    analyticsInstance.init(credentials);
    expect(() => {
      analyticsInstance.clickedObjectIDsAfterSearch();
    }).toThrowError(
      "No params were sent to clickedObjectIDsAfterSearch function, please provide `queryID`,  `objectIDs` and `positions` to be reported"
    );
  });

  test("Should throw if objectIDs is not sent", () => {
    analyticsInstance.init(credentials);
    expect(() => {
      (analyticsInstance as any).clickedObjectIDsAfterSearch({
        queryID: "testing",
        positions: [1]
      });
    }).toThrowError(
      "required objectIDs parameter was not sent, click event can not be properly sent without"
    );
  });

  test("Should throw if positions is not sent", () => {
    analyticsInstance.init(credentials);
    expect(() => {
      (analyticsInstance as any).clickedObjectIDsAfterSearch({
        queryID: "testing",
        objectIDs: [1]
      });
    }).toThrowError(
      "required positions parameter was not sent, click event can not be properly sent without"
    );
  });

  test("Should throw if queryID is not sent", () => {
    analyticsInstance.init(credentials);
    expect(() => {
      (analyticsInstance as any).clickedObjectIDsAfterSearch({
        objectIDs: ["1"],
        positions: [1]
      });
    }).toThrowError(
      "required queryID parameter was not sent, click event can not be properly sent without"
    );
  });

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
      clickParams,
      undefined
    );
  });
});

describe("clickedObjectIDs", () => {
  it("should throw if no parameters is passed", () => {
    analyticsInstance.init(credentials);
    expect(() => {
      analyticsInstance.clickedObjectIDs();
    }).toThrowErrorMatchingInlineSnapshot(
      `"No params were sent to clickedObjectIDs function, please provide \`objectIDs\` to be reported"`
    );
  });
  it("should throw if objectIDs is not sent", () => {
    analyticsInstance.init(credentials);
    expect(() => {
      analyticsInstance.clickedObjectIDs({});
    }).toThrowErrorMatchingInlineSnapshot(
      `"required \`objectIDs\` parameter was not sent, click event can not be properly sent without"`
    );
  });
  it("should call sendEvent with proper params", () => {
    const clickParams = {
      objectIDs: ["2"]
    };

    analyticsInstance.init(credentials);
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.clickedObjectIDs(clickParams);

    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams,
      undefined
    );
  });
});

describe("clickedFilters", () => {
  it("should throw if no parameters is passed", () => {
    analyticsInstance.init(credentials);
    expect(() => {
      analyticsInstance.clickedFilters();
    }).toThrowErrorMatchingInlineSnapshot(
      `"No params were sent to clickedFilters function, please provide \`filters\` to be reported"`
    );
  });
  it("should throw if filters is not sent", () => {
    analyticsInstance.init(credentials);
    expect(() => {
      analyticsInstance.clickedFilters({});
    }).toThrowErrorMatchingInlineSnapshot(
      `"required \`filters\` parameter was not sent, click event can not be properly sent without"`
    );
  });
  it("should call sendEvent with proper params", () => {
    const clickParams = {
      filters: ["brands:apple"]
    };

    analyticsInstance.init(credentials);
    (analyticsInstance as any).sendEvent = jest.fn();
    analyticsInstance.clickedFilters(clickParams);

    expect((analyticsInstance as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams,
      undefined
    );
  });
});

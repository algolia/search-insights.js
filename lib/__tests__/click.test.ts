import { getInstance } from "../../tests/utils";

const credentials = {
  apiKey: "test",
  appId: "test"
};

let AlgoliaInsights;
beforeEach(() => {
  AlgoliaInsights = getInstance();
});

describe("clickedObjectIDsAfterSearch", () => {
  test("Should throw if queryID, objectIDs or positions are not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.clickedObjectIDsAfterSearch();
    }).toThrowError(
      "No params were sent to clickedObjectIDsAfterSearch function, please provide `queryID`,  `objectIDs` and `positions` to be reported"
    );
  });

  test("Should throw if objectIDs is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      (AlgoliaInsights as any).clickedObjectIDsAfterSearch({
        queryID: "testing",
        positions: [1]
      });
    }).toThrowError(
      "required objectIDs parameter was not sent, click event can not be properly sent without"
    );
  });

  test("Should throw if positions is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      (AlgoliaInsights as any).clickedObjectIDsAfterSearch({
        queryID: "testing",
        objectIDs: [1]
      });
    }).toThrowError(
      "required positions parameter was not sent, click event can not be properly sent without"
    );
  });

  test("Should throw if queryID is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      (AlgoliaInsights as any).clickedObjectIDsAfterSearch({
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

    AlgoliaInsights.init(credentials);
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.clickedObjectIDsAfterSearch(clickParams);

    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams
    );
  });
});

describe("clickedObjectIDs", () => {
  it("should throw if no parameters is passed", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.clickedObjectIDs();
    }).toThrowErrorMatchingInlineSnapshot(
      `"No params were sent to clickedObjectIDs function, please provide \`objectIDs\` to be reported"`
    );
  });
  it("should throw if objectIDs is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.clickedObjectIDs({});
    }).toThrowErrorMatchingInlineSnapshot(
      `"required \`objectIDs\` parameter was not sent, click event can not be properly sent without"`
    );
  });
  it("should call sendEvent with proper params", () => {
    const clickParams = {
      objectIDs: ["2"]
    };

    AlgoliaInsights.init(credentials);
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.clickedObjectIDs(clickParams);

    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams
    );
  });
});

describe("clickedFilters", () => {
  it("should throw if no parameters is passed", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.clickedFilters();
    }).toThrowErrorMatchingInlineSnapshot(
      `"No params were sent to clickedFilters function, please provide \`filters\` to be reported"`
    );
  });
  it("should throw if filters is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.clickedFilters({});
    }).toThrowErrorMatchingInlineSnapshot(
      `"required \`filters\` parameter was not sent, click event can not be properly sent without"`
    );
  });
  it("should call sendEvent with proper params", () => {
    const clickParams = {
      filters: ["brands:apple"]
    };

    AlgoliaInsights.init(credentials);
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.clickedFilters(clickParams);

    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams
    );
  });
});

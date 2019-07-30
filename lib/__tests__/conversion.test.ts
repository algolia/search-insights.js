import { getInstance } from "../../tests/utils";

const credentials = {
  apiKey: "test",
  appId: "test"
};
describe("convertedObjectIDsAfterSearch", () => {
  let AlgoliaInsights;
  beforeEach(() => {
    AlgoliaInsights = getInstance();
  });

  it("Should throw if no params are sent", () => {
    expect(() => {
      AlgoliaInsights.init(credentials);
      (AlgoliaInsights as any).convertedObjectIDsAfterSearch();
    }).toThrowError(
      "No params were sent to convertedObjectIDsAfterSearch function, please provide `queryID` and `objectIDs` to be reported"
    );
  });

  it("Should throw if no queryID has been passed", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);

    expect(() => {
      (AlgoliaInsights as any).convertedObjectIDsAfterSearch({
        objectIDs: ["12345"]
      });
      expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required queryID parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("Should throw if no objectIDs has been passed", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);

    expect(() => {
      (AlgoliaInsights as any).convertedObjectIDsAfterSearch({
        queryID: "test"
      });
      expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("Should send allow passing of queryID", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.convertedObjectIDsAfterSearch({
      objectIDs: ["12345"],
      queryID: "test"
    });
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalled();
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      { objectIDs: ["12345"], queryID: "test" }
    );
  });
});

describe("convertedObjectIDs", () => {
  let AlgoliaInsights;
  beforeEach(() => {
    AlgoliaInsights = getInstance();
  });

  it("should throw if no params are sent", () => {
    expect(() => {
      AlgoliaInsights.init(credentials);
      (AlgoliaInsights as any).convertedObjectIDs();
    }).toThrowError(
      "No params were sent to convertedObjectIDs function, please provide `objectIDs` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);

    expect(() => {
      (AlgoliaInsights as any).convertedObjectIDs({ queryID: "test" });
      expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("should send allow passing of queryID", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.convertedObjectIDs({
      objectIDs: ["12345"]
    });
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalled();
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      { objectIDs: ["12345"] }
    );
  });
});

describe("convertedFilters", () => {
  let AlgoliaInsights;
  beforeEach(() => {
    AlgoliaInsights = getInstance();
  });

  it("should throw if no params are sent", () => {
    expect(() => {
      AlgoliaInsights.init(credentials);
      (AlgoliaInsights as any).convertedFilters();
    }).toThrowError(
      "No params were sent to convertedFilters function, please provide `filters` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);

    expect(() => {
      (AlgoliaInsights as any).convertedFilters({});
      expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required filters parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("should send allow passing of queryID", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.convertedFilters({
      filters: ["brands:apple"]
    });
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalled();
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
      "conversion",
      { filters: ["brands:apple"] }
    );
  });
});

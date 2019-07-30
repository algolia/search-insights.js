import { getInstance } from "../../tests/utils";

const credentials = {
  apiKey: "test",
  appId: "test"
};
describe("viewedObjectIDs", () => {
  let AlgoliaInsights;
  beforeEach(() => {
    AlgoliaInsights = getInstance();
  });

  it("should throw if no params are sent", () => {
    expect(() => {
      AlgoliaInsights.init(credentials);
      (AlgoliaInsights as any).viewedObjectIDs();
    }).toThrowError(
      "No params were sent to viewedObjectIDs function, please provide `objectIDs` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);

    expect(() => {
      (AlgoliaInsights as any).viewedObjectIDs({ queryID: "test" });
      expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, view event can not be properly sent without"
    );
  });

  it("should send allow passing of queryID", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.viewedObjectIDs({
      objectIDs: ["12345"]
    });
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalled();
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith("view", {
      objectIDs: ["12345"]
    });
  });
});

describe("viewedFilters", () => {
  let AlgoliaInsights;
  beforeEach(() => {
    AlgoliaInsights = getInstance();
  });

  it("should throw if no params are sent", () => {
    expect(() => {
      AlgoliaInsights.init(credentials);
      (AlgoliaInsights as any).viewedFilters();
    }).toThrowError(
      "No params were sent to viewedFilters function, please provide `filters` to be reported"
    );
  });

  it("should throw if no objectIDs has been passed", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);

    expect(() => {
      (AlgoliaInsights as any).viewedFilters({});
      expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required filters parameter was not sent, view event can not be properly sent without"
    );
  });

  it("should send allow passing of queryID", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.viewedFilters({
      filters: ["brands:apple"]
    });
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalled();
    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith("view", {
      filters: ["brands:apple"]
    });
  });
});

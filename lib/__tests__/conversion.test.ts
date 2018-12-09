import AlgoliaInsights from "../insights";

const credentials = {
  apiKey: "test",
  applicationID: "test"
};
describe("convertedObjectIDInSearch", () => {
  it("Should throw if no params are sent", () => {
    expect(() => {
      AlgoliaInsights.init(credentials);
      (AlgoliaInsights as any).convertedObjectIDInSearch();
    }).toThrowError(
      "No params were sent to convertedObjectIDInSearch function, please provide `queryID` and `objectIDs` to be reported"
    );
  });

  it("Should throw if no queryID has been passed", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);

    expect(() => {
      (AlgoliaInsights as any).convertedObjectIDInSearch({
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
      (AlgoliaInsights as any).convertedObjectIDInSearch({ queryID: "test" });
      expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
    }).toThrowError(
      "required objectIDs parameter was not sent, conversion event can not be properly sent without"
    );
  });

  it("Should send allow passing of queryID", () => {
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.convertedObjectIDInSearch({
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

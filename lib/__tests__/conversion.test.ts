import AlgoliaInsights from "../insights";

const credentials = {
  apiKey: "test",
  applicationID: "test"
};

it("Should throw if init was not called", () => {
  expect(() => {
    AlgoliaInsights.conversion();
  }).toThrowError(
    "Before calling any methods on the analytics, you first need to call the 'init' function with applicationID and apiKey parameters"
  );
});

it("Should throw if objectID is not sent", () => {
  expect(() => {
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.conversion();
  }).toThrowError(
    "No parameters were sent to conversion event, please provide an objectID"
  );
});

it("Should throw if no queryID is set in storage", () => {
  (AlgoliaInsights as any).sendEvent = jest.fn();
  AlgoliaInsights.init(credentials);

  expect(() => {
    AlgoliaInsights.conversion({ objectID: "12345" });
    expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
  }).toThrowError(
    `No queryID was retrieved, please check the implementation and provide either a getQueryID function
    or call the conversion method that will return the queryID parameter`
  );
});

it("Should send conversion event with proper queryID", () => {
  (AlgoliaInsights as any).sendEvent = jest.fn();
  AlgoliaInsights.init(credentials);
  AlgoliaInsights.storageManager.getConversionObjectID = jest.fn(() => ({
    queryID: "queryID"
  }));
  AlgoliaInsights.conversion({ objectID: "12345", queryID: "queryID" });
  expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalled();
});

it("Should send allow passing of queryID", () => {
  (AlgoliaInsights as any).sendEvent = jest.fn();
  AlgoliaInsights.init(credentials);
  AlgoliaInsights.conversion({ objectID: "12345", queryID: "test" });
  expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalled();
  expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
    "conversion",
    { objectID: "12345", queryID: "test" }
  );
});

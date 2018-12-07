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

it("Should throw if no params are sent", () => {
  expect(() => {
    AlgoliaInsights.init(credentials);
    AlgoliaInsights.conversion();
  }).toThrowError(
    "No parameters were sent to conversion event, please provide a queryID and objectIDs"
  );
});

it("Should throw if no queryID has been passed", () => {
  (AlgoliaInsights as any).sendEvent = jest.fn();
  AlgoliaInsights.init(credentials);

  expect(() => {
    AlgoliaInsights.conversion({ objectIDs: ["12345"] });
    expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
  }).toThrowError(
    "No parameters were sent to conversion event, please provide a queryID"
  );
});

it("Should send allow passing of queryID", () => {
  (AlgoliaInsights as any).sendEvent = jest.fn();
  AlgoliaInsights.init(credentials);
  AlgoliaInsights.conversion({ objectIDs: ["12345"], queryID: "test" });
  expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalled();
  expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
    "conversion",
    { objectIDs: ["12345"], queryID: "test" }
  );
});

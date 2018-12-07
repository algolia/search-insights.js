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
    "No params were sent to conversion function, please provide `queryID` and `objectIDs` to be reported"
  );
});

it("Should throw if no queryID has been passed", () => {
  (AlgoliaInsights as any).sendEvent = jest.fn();
  AlgoliaInsights.init(credentials);

  expect(() => {
    AlgoliaInsights.conversion({ objectIDs: ["12345"] });
    expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
  }).toThrowError(
    "required queryID parameter was not sent, conversion event can not be properly sent without"
  );
});

it("Should throw if no objectIDs has been passed", () => {
  (AlgoliaInsights as any).sendEvent = jest.fn();
  AlgoliaInsights.init(credentials);

  expect(() => {
    AlgoliaInsights.conversion({ queryID: "test" });
    expect((AlgoliaInsights as any).sendEvent).not.toHaveBeenCalled();
  }).toThrowError(
    "required objectIDs parameter was not sent, conversion event can not be properly sent without"
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

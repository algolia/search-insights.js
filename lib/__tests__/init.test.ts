import AlgoliaInsights from "../insights";

const credentials = {
  apiKey: "test",
  applicationID: "test"
};

describe("init", () => {
  it("should throw if no parameters is passed", () => {
    expect(() => {
      (AlgoliaInsights as any).init();
    }).toThrowErrorMatchingInlineSnapshot(
      `"Init function should be called with an object argument containing your apiKey and applicationID"`
    );
  });
  it("should throw if apiKey is not sent", () => {
    expect(() => {
      (AlgoliaInsights as any).init({ applicationID: "***" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"apiKey is missing, please provide it so we can authenticate the application"`
    );
  });
  it("should throw if applicationID is not sent", () => {
    expect(() => {
      (AlgoliaInsights as any).init({ apiKey: "***" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"applicationID is missing, please provide it, so we can properly attribute data to your application"`
    );
  });
  it("should throw if region is other than `de` | `us`", () => {
    expect(() => {
      (AlgoliaInsights as any).init({
        applicationID: "xxx",
        apiKey: "***",
        region: "emea"
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"optional region is incorrect, please provide either one of: de, us."`
    );
  });
  it("should set _applicationID on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX" });
    expect(AlgoliaInsights._applicationID).toBe("XXX");
  });
  it("should set _apiKey on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX" });
    expect(AlgoliaInsights._apiKey).toBe("***");
  });
  it("should set _region on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX", region: "us" });
    expect(AlgoliaInsights._region).toBe("us");
  });
  it("should set _endpointOrigin on instance to https://insights.algolia.io", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX" });
    expect(AlgoliaInsights._endpointOrigin).toBe("https://insights.algolia.io");
  });
  it("should set _endpointOrigin on instance to https://insights.us.algolia.io if region === 'us'", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX", region: "us" });
    expect(AlgoliaInsights._endpointOrigin).toBe(
      "https://insights.us.algolia.io"
    );
  });
  it("should set _endpointOrigin on instance to https://insights.de.algolia.io if region === 'de'", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX", region: "de" });
    expect(AlgoliaInsights._endpointOrigin).toBe(
      "https://insights.de.algolia.io"
    );
  });
});

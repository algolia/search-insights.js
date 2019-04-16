import AlgoliaInsights from "../insights";

jest.mock("../../package.json", () => ({ version: "1.0.1" }));

describe("algoliaAgent", () => {
  beforeEach(() => {
    AlgoliaInsights.init({ apiKey: "test", appId: "test" });
  });

  it("should initialize the client with a default algoliaAgent string", () => {
    expect(AlgoliaInsights._ua).toEqual("insights-js (1.0.1)");
    expect(AlgoliaInsights._uaURIEncoded).toEqual("insights-js%20(1.0.1)");
  });

  it("should allow adding a string to algoliaAgent", () => {
    AlgoliaInsights.addAlgoliaAgent("other string");
    expect(AlgoliaInsights._ua).toEqual("insights-js (1.0.1); other string");
    expect(AlgoliaInsights._uaURIEncoded).toEqual(
      "insights-js%20(1.0.1)%3B%20other%20string"
    );
  });

  it("should duplicate a string when added twice", () => {
    AlgoliaInsights.addAlgoliaAgent("duplicated string");
    AlgoliaInsights.addAlgoliaAgent("duplicated string");

    expect(AlgoliaInsights._ua).toEqual(
      "insights-js (1.0.1); duplicated string"
    );
    expect(AlgoliaInsights._uaURIEncoded).toEqual(
      "insights-js%20(1.0.1)%3B%20duplicated%20string"
    );
  });
});

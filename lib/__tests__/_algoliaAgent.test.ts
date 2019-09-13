import AlgoliaAnalytics from "../insights";

jest.mock("../../package.json", () => ({ version: "1.0.1" }));

describe("algoliaAgent", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
    analyticsInstance.init({ apiKey: "test", appId: "test" });
  });

  it("should initialize the client with a default algoliaAgent string", () => {
    expect(analyticsInstance._ua).toEqual("insights-js (1.0.1)");
    expect(analyticsInstance._uaURIEncoded).toEqual("insights-js%20(1.0.1)");
  });

  it("should allow adding a string to algoliaAgent", () => {
    analyticsInstance.addAlgoliaAgent("other string");
    expect(analyticsInstance._ua).toEqual("insights-js (1.0.1); other string");
    expect(analyticsInstance._uaURIEncoded).toEqual(
      "insights-js%20(1.0.1)%3B%20other%20string"
    );
  });

  it("should duplicate a string when added twice", () => {
    analyticsInstance.addAlgoliaAgent("duplicated string");
    analyticsInstance.addAlgoliaAgent("duplicated string");

    expect(analyticsInstance._ua).toEqual(
      "insights-js (1.0.1); duplicated string"
    );
    expect(analyticsInstance._uaURIEncoded).toEqual(
      "insights-js%20(1.0.1)%3B%20duplicated%20string"
    );
  });
});

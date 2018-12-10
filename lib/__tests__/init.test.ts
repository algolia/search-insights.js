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
});

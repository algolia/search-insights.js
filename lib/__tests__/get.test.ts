import AlgoliaAnalytics from "../insights";

describe("get", () => {
  let analyticsInstance;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should get values from instance after init", () => {
    const callback = jest.fn();
    analyticsInstance.init({
      appId: "xxx",
      apiKey: "***",
      region: "us"
    });
    analyticsInstance._get("appId", callback);
  });
});

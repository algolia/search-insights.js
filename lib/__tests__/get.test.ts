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
    analyticsInstance._get("_appId", callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("xxx");

    analyticsInstance._get("_apiKey", callback);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith("***");

    analyticsInstance._get("_region", callback);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith("us");

    analyticsInstance._get("_hasCredentials", callback);
    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback).toHaveBeenCalledWith(true);
  });
});

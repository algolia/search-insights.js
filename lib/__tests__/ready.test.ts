import AlgoliaAnalytics from "../insights";

describe("ready()", () => {
  it("should execute the callback", () => {
    const analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
    const callback = jest.fn();
    analyticsInstance.ready(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

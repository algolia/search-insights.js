import { createInsightsClient } from "../_createInsightsClient";

describe("createInsightsClient", () => {
  beforeEach(() => {
    window.AlgoliaAnalyticsObject = undefined;
  });

  it("should return a function", () => {
    expect(typeof createInsightsClient(() => {})).toBe("function");
  });

  it("registers itself to window", () => {
    const aa = createInsightsClient(() => {});

    expect(typeof window.AlgoliaAnalyticsObject).toBe("string");
    expect(window[window.AlgoliaAnalyticsObject!]).toBe(aa);
  });

  it("doesn't register itself to window if key is already taken", () => {
    window.AlgoliaAnalyticsObject = "existingKey";
    const aa = createInsightsClient(() => {});

    expect(window.AlgoliaAnalyticsObject).toBe("existingKey");
    expect(window[window.AlgoliaAnalyticsObject!]).not.toBe(aa);
  });

  it("doesn't register if no window", () => {
    delete (global as any).window;

    expect(typeof createInsightsClient(() => {})).toBe("function");
  });
});

import { version } from "../../package.json";
import { createInsightsClient } from "../_createInsightsClient";

describe("createInsightsClient", () => {
  beforeEach(() => {
    window.AlgoliaAnalyticsObject = undefined;
  });

  it("should return a function", () => {
    expect(typeof createInsightsClient(jest.fn())).toBe("function");
  });

  it("returns its version number", () => {
    const aa = createInsightsClient(jest.fn());

    expect(aa.version).toEqual(version);
  });

  it("registers itself to window", () => {
    const aa = createInsightsClient(jest.fn());

    expect(typeof window.AlgoliaAnalyticsObject).toBe("string");
    // @ts-expect-error
    expect(window[window.AlgoliaAnalyticsObject!]).toBe(aa);
  });

  it("doesn't register itself to window if key is already taken", () => {
    window.AlgoliaAnalyticsObject = "existingKey";
    const aa = createInsightsClient(jest.fn());

    expect(window.AlgoliaAnalyticsObject).toBe("existingKey");
    // @ts-expect-error
    expect(window[window.AlgoliaAnalyticsObject!]).not.toBe(aa);
  });

  it("doesn't register if no window", () => {
    delete (global as any).window;

    expect(typeof createInsightsClient(jest.fn())).toBe("function");
  });
});

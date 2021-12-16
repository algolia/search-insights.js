import { jest } from "@jest/globals";
import AlgoliaAnalytics from "../insights";
import { getFunctionalInterface } from "../_getFunctionalInterface";

describe("_getFunctionalInterface", () => {
  let aa;

  beforeEach(() => {
    const analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
    aa = getFunctionalInterface(analyticsInstance);
  });

  it("warn about unknown function name", () => {
    console.warn = jest.fn();
    aa("unknown-function");
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "The method `unknown-function` doesn't exist."
    );
  });
});

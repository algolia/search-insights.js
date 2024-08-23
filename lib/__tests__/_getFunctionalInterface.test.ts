/* eslint-disable no-console */

import { getFunctionalInterface } from "../_getFunctionalInterface";
import AlgoliaAnalytics from "../insights";
import type { InsightsClient, InsightsMethodMap } from "../types";

jest.mock("../../package.json", () => ({
  version: "1.0.1"
}));

describe("_getFunctionalInterface", () => {
  let aa: InsightsClient;

  beforeEach(() => {
    const analyticsInstance = new AlgoliaAnalytics({
      requestFn: jest.fn().mockResolvedValue(true)
    });
    aa = getFunctionalInterface(analyticsInstance);
  });

  it("warn about unknown function name", () => {
    console.warn = jest.fn();
    // @ts-expect-error
    aa("unknown-function");
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "The method `unknown-function` doesn't exist."
    );
  });

  it.each<keyof InsightsMethodMap>([
    "addedToCartObjectIDs",
    "addedToCartObjectIDsAfterSearch",
    "clickedFilters",
    "clickedObjectIDs",
    "clickedObjectIDsAfterSearch",
    "convertedFilters",
    "convertedObjectIDs",
    "convertedObjectIDsAfterSearch",
    "purchasedObjectIDs",
    "purchasedObjectIDsAfterSearch",
    "viewedFilters",
    "viewedObjectIDs"
  ])("returns a promise to be waited on for %s call", async (method) => {
    aa("init", {
      appId: "appId",
      apiKey: "apiKey"
    });
    const result = await aa(method, {
      eventName: "click",
      objectIDs: ["1", "2"],
      index: "index"
    });
    expect(result).toBe(true);
  });

  it("returns a promise to be waited on for sendEvents call", async () => {
    aa("init", {
      appId: "appId",
      apiKey: "apiKey"
    });
    const result = await aa("sendEvents", [
      {
        eventName: "click",
        eventType: "click",
        objectIDs: ["1", "2"],
        index: "index"
      }
    ]);
    expect(result).toBe(true);
  });

  it("returns values on sync calls", () => {
    aa("init", {
      appId: "appId",
      apiKey: "apiKey",
      userToken: "userToken",
      authenticatedUserToken: "authenticatedUserToken"
    });
    expect(aa("getAuthenticatedUserToken")).toBe("authenticatedUserToken");
    expect(aa("getUserToken")).toBe("userToken");
    expect(aa("getVersion")).toBe("1.0.1");
    expect(aa("setAuthenticatedUserToken", "newAuthenticatedUserToken")).toBe(
      "newAuthenticatedUserToken"
    );
    expect(aa("setUserToken", "newUserToken")).toBe("newUserToken");
  });
});

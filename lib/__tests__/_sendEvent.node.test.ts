/**
 * @jest-environment node
 */
import { getInstance } from "../../tests/utils";

const credentials = {
  apiKey: "testKey",
  appId: "testId"
};

describe("_sendEvent in node env", () => {
  let AlgoliaInsights;
  beforeEach(() => {
    AlgoliaInsights = getInstance();
    AlgoliaInsights.init(credentials);
  });

  it("throws when user token is not set", () => {
    expect(() => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
    }).toThrowError(
      "Before calling any methods on the analytics, you first need to call 'setUserToken' function."
    );
  });

  it("does not throw when user token is set", () => {
    (AlgoliaInsights as any).setUserToken("aaa");
    expect(() => {
      (AlgoliaInsights as any).sendEvent("click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
    }).not.toThrowError(
      "Before calling any methods on the analytics, you first need to call 'setUserToken' function."
    );
  });
});

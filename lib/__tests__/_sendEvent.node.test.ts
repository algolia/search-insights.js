/**
 * @jest-environment node
 */
import AlgoliaAnalytics from "../insights";
import { getRequesterForNode } from "../utils/getRequesterForNode";
import { getFunctionalInterface } from "../_getFunctionalInterface";

const credentials = {
  apiKey: "testKey",
  appId: "testId"
};

describe("_sendEvent in node env", () => {
  let aa;
  beforeEach(() => {
    const instance = new AlgoliaAnalytics({ requestFn: getRequesterForNode() });
    aa = getFunctionalInterface(instance);
    aa("init", credentials);
  });

  it("throws when user token is not set", () => {
    expect(() => {
      aa("sendEvent", "click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
    }).toThrowError(
      "Before calling any methods on the analytics, you first need to call 'setUserToken' function or include 'userToken' in the event payload."
    );
  });

  it("does not throw when user token is set", () => {
    aa("setUserToken", "aaa");
    expect(() => {
      aa("sendEvent", "click", {
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
    }).not.toThrowError();
  });

  it("does not throw when user token is set inside payload", () => {
    expect(() => {
      aa("sendEvent", "click", {
        userToken: "aaa",
        eventName: "my-event",
        index: "my-index",
        objectIDs: ["1"]
      });
    }).not.toThrowError();
  });
});
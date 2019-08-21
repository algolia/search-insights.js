/**
 * @jest-environment node
 */
import AlgoliaAnalytics from "../insights";
import { getRequesterForNode } from "../utils/getRequesterForNode";
import { getFunctionalInterface } from "../_getFunctionalInterface";
import { setUserToken } from "../_cookieUtils";

const credentials = {
  apiKey: "testKey",
  appId: "testId"
};

const defaultPayload = {
  eventName: "my-event",
  index: "my-index",
  objectIDs: ["1"]
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
        ...defaultPayload
      });
    }).toThrowError(
      "Before calling any methods on the analytics, you first need to call 'setUserToken' function or include 'userToken' in the event payload."
    );
  });

  it("does not throw when user token is set", () => {
    aa("setUserToken", "aaa");
    expect(() => {
      aa("sendEvent", "click", {
        ...defaultPayload
      });
    }).not.toThrowError();
  });

  it("does not throw when user token is set inside payload", () => {
    expect(() => {
      aa("sendEvent", "click", {
        userToken: "aaa",
        ...defaultPayload
      });
    }).not.toThrowError();
  });

  it("throws when user token in payload is not a string", () => {
    expect(() => {
      aa("sendEvent", "click", {
        userToken: 3,
        ...defaultPayload
      });
    }).toThrowError("expected optional parameter `userToken` to be a string");
  });

  it("throws when user token is an empty string", () => {
    expect(() => {
      aa("setUserToken", "");
      aa("sendEvent", "click", {
        ...defaultPayload
      });
    }).toThrowError("`userToken` cannot be an empty string.");

    expect(() => {
      aa("sendEvent", "click", {
        userToken: "",
        ...defaultPayload
      });
    }).toThrowError("`userToken` cannot be an empty string.");
  });
});

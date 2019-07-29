/**
 * @jest-environment node
 */
import aa from "../entryNode";

const credentials = {
  apiKey: "testKey",
  appId: "testId"
};

describe("_sendEvent in node env", () => {
  beforeEach(() => {
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
      "Before calling any methods on the analytics, you first need to call 'setUserToken' function."
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
    }).not.toThrowError(
      "Before calling any methods on the analytics, you first need to call 'setUserToken' function."
    );
  });
});

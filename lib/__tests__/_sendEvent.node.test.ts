/**
 * @jest-environment node
 */
import AlgoliaAnalytics from "../insights";
import { getRequesterForNode } from "../utils/getRequesterForNode";
import { getFunctionalInterface } from "../_getFunctionalInterface";
import { setUserToken } from "../_tokenUtils";
import { version } from "../../package.json";

const credentials = {
  apiKey: "testKey",
  appId: "testId"
};

const defaultPayload = {
  eventName: "my-event",
  index: "my-index",
  objectIDs: ["1"]
};

const defaultRequestUrl = `https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(${version})`;

describe("_sendEvent in node env", () => {
  let aa;
  let requestFn;
  beforeEach(() => {
    requestFn = jest.fn((url, data) => {});
    const instance = new AlgoliaAnalytics({ requestFn });
    aa = getFunctionalInterface(instance);
    aa("init", credentials);
  });

  it("does not throw when user token is not set", () => {
    expect(() => {
      aa("sendEvent", {
        eventType: "click",
        ...defaultPayload
      });
    }).not.toThrowError();

    expect(requestFn).toHaveBeenCalledWith(defaultRequestUrl, {
      events: [
        {
          eventName: "my-event",
          eventType: "click",
          index: "my-index",
          objectIDs: ["1"],
          userToken: undefined
        }
      ]
    });
  });

  it("does not throw when user token is included", () => {
    expect(() => {
      aa("sendEvent", {
        eventType: "click",
        ...defaultPayload,
        userToken: "aaa"
      });
    }).not.toThrowError();

    expect(requestFn).toHaveBeenCalledWith(defaultRequestUrl, {
      events: [
        {
          eventName: "my-event",
          eventType: "click",
          index: "my-index",
          objectIDs: ["1"],
          userToken: "aaa"
        }
      ]
    });
  });
});

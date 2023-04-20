/**
 * @jest-environment node
 */
import AlgoliaAnalytics from "../insights";
import { getFunctionalInterface } from "../_getFunctionalInterface";
import { version } from "../../package.json";

const defaultPayload = {
  eventName: "my-event",
  index: "my-index",
  objectIDs: ["1"]
};

const defaultRequestUrl = `https://insights.algolia.io/1/events?X-Algolia-Application-Id=testId&X-Algolia-API-Key=testKey&X-Algolia-Agent=insights-js%20(${version})%3B%20insights-js-node-cjs%20(${version})`;

describe("_sendEvent in node env", () => {
  let aa;
  let requestFn;
  beforeEach(() => {
    requestFn = jest.fn((url, data) => {});
    const instance = new AlgoliaAnalytics({ requestFn });
    aa = getFunctionalInterface(instance);
    aa("init", {
      apiKey: "testKey",
      appId: "testId",
      anonymousUserToken: false
    });
  });

  it("does not throw when user token is not set", () => {
    expect(() => {
      aa("sendEvents", [
        {
          eventType: "click",
          ...defaultPayload
        }
      ]);
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
      aa("sendEvents", [
        {
          eventType: "click",
          ...defaultPayload,
          userToken: "aaa"
        }
      ]);
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

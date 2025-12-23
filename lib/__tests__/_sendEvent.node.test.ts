/**
 * @jest-environment node
 */
import { version } from "../../package.json";
import { getFunctionalInterface } from "../_getFunctionalInterface";
import AlgoliaAnalytics from "../insights";
import type { InsightsClient } from "../types";
import type { RequestFnType } from "../utils/request";

const defaultPayload = {
  eventName: "my-event",
  index: "my-index",
  objectIDs: ["1"]
};

const defaultRequestUrl = "https://insights.algolia.io/1/events";
const defaultHeaders = {
  "X-Algolia-Application-Id": "testId",
  "X-Algolia-API-Key": "testKey",
  "X-Algolia-Agent": `insights-js%20(${version})%3B%20insights-js-node-cjs%20(${version})`
};

describe("_sendEvent in node env", () => {
  let aa: InsightsClient;
  const requestFn: jest.MockedFunction<RequestFnType> = jest.fn();
  beforeEach(() => {
    requestFn.mockResolvedValue(true);
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

    expect(requestFn).toHaveBeenCalledWith(
      defaultRequestUrl,
      {
        events: [
          {
            eventName: "my-event",
            eventType: "click",
            index: "my-index",
            objectIDs: ["1"],
            userToken: undefined,
            authenticatedUserToken: undefined
          }
        ]
      },
      defaultHeaders
    );
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

    expect(requestFn).toHaveBeenCalledWith(
      defaultRequestUrl,
      {
        events: [
          {
            eventName: "my-event",
            eventType: "click",
            index: "my-index",
            objectIDs: ["1"],
            userToken: "aaa",
            authenticatedUserToken: undefined
          }
        ]
      },
      defaultHeaders
    );
  });
});

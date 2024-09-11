import AlgoliaAnalytics from "../insights";
import { getQueryForObject } from "../utils";

const credentials = {
  apiKey: "test",
  appId: "test"
};

const additionalParameters = {
  headers: {
    "X-Algolia-Application-Id": "overrideApp123",
    "X-Algolia-API-Key": "overrideKey123"
  }
};

let analyticsInstance: AlgoliaAnalytics;

beforeEach(() => {
  analyticsInstance = new AlgoliaAnalytics({
    requestFn: jest.fn().mockResolvedValue(true)
  });
  analyticsInstance.init(credentials);
  analyticsInstance.sendEvents = jest.fn();
  localStorage.clear();
});

describe("clickedObjectIDsAfterSearch", () => {
  const clickParams = {
    index: "index1",
    eventName: "hit clicked",
    positions: [1],
    objectIDs: ["2"],
    queryID: "testing"
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.clickedObjectIDsAfterSearch(clickParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "click",
          ...clickParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.clickedObjectIDsAfterSearch(
      clickParams,
      additionalParameters
    );
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });

  it("should store the queryID", () => {
    expect(getQueryForObject("index1", "2")).toBeUndefined();
    analyticsInstance.clickedObjectIDsAfterSearch(clickParams);
    expect(getQueryForObject("index1", "2")).toEqual([
      "testing",
      expect.any(Number)
    ]);
  });

  it("shouldn't store the queryID when user has opted out", () => {
    const aa = new AlgoliaAnalytics({
      requestFn: jest.fn().mockResolvedValue(true)
    });
    aa.init({ ...credentials, userHasOptedOut: true });
    expect(getQueryForObject("index1", "2")).toBeUndefined();
    aa.clickedObjectIDsAfterSearch(clickParams);
    expect(getQueryForObject("index1", "2")).toBeUndefined();
  });
});

describe("clickedObjectIDs", () => {
  const clickParams = {
    index: "index1",
    eventName: "hit clicked",
    objectIDs: ["2"]
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.clickedObjectIDs(clickParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "click",
          ...clickParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.clickedObjectIDs(clickParams, additionalParameters);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });
});

describe("clickedFilters", () => {
  const clickParams = {
    index: "index1",
    eventName: "filters clicked",
    filters: ["brands:apple"]
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.clickedFilters(clickParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "click",
          ...clickParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.clickedFilters(clickParams, additionalParameters);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });
});

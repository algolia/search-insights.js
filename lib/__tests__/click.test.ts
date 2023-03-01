import AlgoliaAnalytics from "../insights";

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
  analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  analyticsInstance.init(credentials);
  (analyticsInstance as any).sendEvents = jest.fn();
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
});

describe("clickedObjectIDs", () => {
  const clickParams = {
    index: "index1",
    eventName: "hit clicked",
    objectIDs: ["2"]
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.clickedObjectIDs(clickParams);
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith(
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
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith(
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

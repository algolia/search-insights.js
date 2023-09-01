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
  analyticsInstance = new AlgoliaAnalytics({
    requestFn: jest.fn().mockResolvedValue(true)
  });
  analyticsInstance.sendEvents = jest.fn();
  analyticsInstance.init(credentials);
});

describe("viewedObjectIDs", () => {
  const viewParams = {
    index: "index1",
    eventName: "hits viewed",
    objectIDs: ["12345"]
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.viewedObjectIDs(viewParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "view",
          ...viewParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.viewedObjectIDs(viewParams, additionalParameters);

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });
});

describe("viewedFilters", () => {
  const viewParams = {
    index: "index1",
    eventName: "filters viewed",
    filters: ["brands:apple"]
  };
  it("should call sendEvents with proper params", () => {
    analyticsInstance.viewedFilters(viewParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalled();
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "view",
          ...viewParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.viewedFilters(viewParams, additionalParameters);

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });
});

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
  (analyticsInstance as any).sendEvents = jest.fn();
  analyticsInstance.init(credentials);
});

describe("convertedObjectIDsAfterSearch", () => {
  const convertParams = {
    index: "index1",
    eventName: "hit converted",
    objectIDs: ["12345"],
    queryID: "test"
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.convertedObjectIDsAfterSearch(convertParams);
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "conversion",
          ...convertParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.convertedObjectIDsAfterSearch(
      convertParams,
      additionalParameters
    );

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });
});

describe("convertedObjectIDs", () => {
  const convertParams = {
    index: "index1",
    eventName: "hit converted",
    objectIDs: ["12345"]
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.convertedObjectIDs(convertParams);
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "conversion",
          ...convertParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.convertedObjectIDs(convertParams, additionalParameters);

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });
});

describe("convertedFilters", () => {
  const convertParams = {
    index: "index1",
    eventName: "filter converted",
    filters: ["brands:apple"]
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.convertedFilters(convertParams);
    expect((analyticsInstance as any).sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "conversion",
          ...convertParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.convertedFilters(convertParams, additionalParameters);

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });
});

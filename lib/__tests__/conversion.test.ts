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
  analyticsInstance.sendEvents = jest.fn();
  analyticsInstance.init(credentials);
  localStorage.clear();
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
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
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

describe("addedToCartObjectIDsAfterSearch", () => {
  const convertParams = {
    index: "index1",
    eventName: "Product added to cart",
    objectIDs: ["12345"],
    queryID: "test",
    objectData: [
      {
        price: "39.98",
        quantity: 2
      }
    ],
    currency: "JPY",
    value: 79.96
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.addedToCartObjectIDsAfterSearch(convertParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "conversion",
          eventSubtype: "addToCart",
          ...convertParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.addedToCartObjectIDsAfterSearch(
      convertParams,
      additionalParameters
    );

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });

  it("should store the queryID", () => {
    expect(getQueryForObject("index1", "12345")).toBeUndefined();
    analyticsInstance.addedToCartObjectIDsAfterSearch(convertParams);
    expect(getQueryForObject("index1", "12345")).toEqual([
      "test",
      expect.any(Number)
    ]);
  });

  it("should store the objectData.queryID if specified", () => {
    expect(getQueryForObject("index1", "12345")).toBeUndefined();
    analyticsInstance.addedToCartObjectIDsAfterSearch({
      ...convertParams,
      objectData: convertParams.objectData.map((data) => ({
        ...data,
        queryID: "objectData-query"
      }))
    });
    expect(getQueryForObject("index1", "12345")).toEqual([
      "objectData-query",
      expect.any(Number)
    ]);
  });
});

describe("purchasedObjectIDsAfterSearch", () => {
  const convertParams = {
    index: "index1",
    eventName: "Product purchased",
    objectIDs: ["12345"],
    objectData: [
      {
        queryID: "query-1",
        price: 12.99,
        quantity: 2
      }
    ],
    currency: "USD",
    value: 25.98
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.purchasedObjectIDsAfterSearch(convertParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "conversion",
          eventSubtype: "purchase",
          ...convertParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.purchasedObjectIDsAfterSearch(
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
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
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

describe("addedToCartObjectIDs", () => {
  const convertParams = {
    index: "index1",
    eventName: "hit converted",
    objectIDs: ["12345"],
    objectData: [
      {
        price: "1.24",
        quantity: 17
      }
    ],
    currency: "GBP",
    value: 21.08
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.addedToCartObjectIDs(convertParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "conversion",
          eventSubtype: "addToCart",
          ...convertParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.addedToCartObjectIDs(convertParams, additionalParameters);

    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      expect.any(Array),
      additionalParameters
    );
  });

  it("should store the objectData.queryID if specified", () => {
    expect(getQueryForObject("index1", "12345")).toBeUndefined();
    analyticsInstance.addedToCartObjectIDs({
      ...convertParams,
      objectData: convertParams.objectData.map((data) => ({
        ...data,
        queryID: "objectData-query"
      }))
    });
    expect(getQueryForObject("index1", "12345")).toEqual([
      "objectData-query",
      expect.any(Number)
    ]);
  });
});

describe("purchasedObjectIDs", () => {
  const convertParams = {
    index: "index1",
    eventName: "hit converted",
    objectIDs: ["12345"],
    objectData: [
      {
        price: 100,
        quantity: 1
      }
    ],
    currency: "AUD",
    value: 100
  };

  it("should call sendEvents with proper params", () => {
    analyticsInstance.purchasedObjectIDs(convertParams);
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
      [
        {
          eventType: "conversion",
          eventSubtype: "purchase",
          ...convertParams
        }
      ],
      undefined
    );
  });

  it("should call sendEvents with additional params if provided", () => {
    analyticsInstance.purchasedObjectIDs(convertParams, additionalParameters);

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
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith(
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

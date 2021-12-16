import { jest } from "@jest/globals";
import AlgoliaAnalytics from "../insights";

const credentials = {
  apiKey: "test",
  appId: "test"
};
describe("convertedObjectIDsAfterSearch", () => {
  let analyticsInstance: AlgoliaAnalytics;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should attach eventType", () => {
    analyticsInstance.sendEvents = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedObjectIDsAfterSearch({
      objectIDs: ["12345"],
      queryID: "test",
      eventName: "testEvent",
      index: "my-index"
    });
    expect(analyticsInstance.sendEvents).toHaveBeenCalled();
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith([
      {
        eventType: "conversion",
        objectIDs: ["12345"],
        queryID: "test",
        eventName: "testEvent",
        index: "my-index"
      }
    ]);
  });
});

describe("convertedObjectIDs", () => {
  let analyticsInstance: AlgoliaAnalytics;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should attach eventType", () => {
    analyticsInstance.sendEvents = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedObjectIDs({
      objectIDs: ["12345"],
      eventName: "testEvent",
      index: "my-index"
    });
    expect(analyticsInstance.sendEvents).toHaveBeenCalled();
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith([
      {
        eventType: "conversion",
        objectIDs: ["12345"],
        eventName: "testEvent",
        index: "my-index"
      }
    ]);
  });
});

describe("convertedFilters", () => {
  let analyticsInstance: AlgoliaAnalytics;
  beforeEach(() => {
    analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
  });

  it("should attach eventType", () => {
    analyticsInstance.sendEvents = jest.fn();
    analyticsInstance.init(credentials);
    analyticsInstance.convertedFilters({
      filters: ["brands:apple"],
      eventName: "testEvent",
      index: "my-index"
    });
    expect(analyticsInstance.sendEvents).toHaveBeenCalled();
    expect(analyticsInstance.sendEvents).toHaveBeenCalledWith([
      {
        eventType: "conversion",
        filters: ["brands:apple"],
        eventName: "testEvent",
        index: "my-index"
      }
    ]);
  });
});

import { addQueryId } from "../_addQueryId";
import type { InsightsEvent } from "../types";
import { storeQueryForObject } from "../utils";

describe("addQueryId", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the same event if the eventType is not conversion", () => {
    storeQueryForObject("index1", "2", "clicked-query");
    const events: InsightsEvent[] = [
      {
        eventType: "click",
        index: "index1",
        eventName: "hit clicked",
        objectIDs: ["2"]
      },
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2"]
      }
    ];
    expect(addQueryId(events)).toEqual([
      {
        eventType: "click",
        index: "index1",
        eventName: "hit clicked",
        objectIDs: ["2"]
      },
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2"],
        objectData: [{ queryID: "clicked-query" }],
        objectIDsWithInferredQueryID: ["2"]
      }
    ]);
  });

  it("returns the same event if a top-level queryID is already present", () => {
    storeQueryForObject("index1", "2", "clicked-query");
    const events: InsightsEvent[] = [
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2"],
        queryID: "test-query"
      }
    ];
    expect(addQueryId(events)).toEqual(events);
  });

  it("returns the same event if a queryID is already present in objectData", () => {
    storeQueryForObject("index1", "2", "clicked-query");
    const events: InsightsEvent[] = [
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2"],
        objectData: [{ queryID: "test-query" }]
      }
    ];
    expect(addQueryId(events)).toEqual(events);
  });

  it("returns the same event if no top-level queryID is present and there's no cache hit", () => {
    const events: InsightsEvent[] = [
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2"]
      }
    ];
    expect(addQueryId(events)).toEqual(events);
  });

  it("returns the same event if no queryID is present in the objectData and there's no cache hit", () => {
    const events: InsightsEvent[] = [
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2"],
        objectData: [{}]
      }
    ];
    expect(addQueryId(events)).toEqual(events);
  });

  it("adds the queryID to the event if it's not already present", () => {
    storeQueryForObject("index1", "2", "clicked-query");
    const events: InsightsEvent[] = [
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2"]
      }
    ];
    expect(addQueryId(events)).toEqual([
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2"],
        objectData: [{ queryID: "clicked-query" }],
        objectIDsWithInferredQueryID: ["2"]
      }
    ]);
  });

  it("adds the queryID to the event if it's not already present for multiple objects", () => {
    storeQueryForObject("index1", "2", "clicked-query");
    storeQueryForObject("index1", "3", "clicked-query");
    const events: InsightsEvent[] = [
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2", "3"]
      }
    ];
    expect(addQueryId(events)).toEqual([
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2", "3"],
        objectData: [
          { queryID: "clicked-query" },
          { queryID: "clicked-query" }
        ],
        objectIDsWithInferredQueryID: ["2", "3"]
      }
    ]);
  });

  it("adds the queryID to the event if it's not already present for one of multiple objects", () => {
    storeQueryForObject("index1", "2", "clicked-query");
    storeQueryForObject("index1", "3", "clicked-query");
    const events: InsightsEvent[] = [
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2", "3"],
        objectData: [{ queryID: "test-query" }, {}]
      }
    ];
    expect(addQueryId(events)).toEqual([
      {
        eventType: "conversion",
        index: "index1",
        eventName: "hit converted",
        objectIDs: ["2", "3"],
        objectData: [{ queryID: "test-query" }, { queryID: "clicked-query" }],
        objectIDsWithInferredQueryID: ["3"]
      }
    ]);
  });
});

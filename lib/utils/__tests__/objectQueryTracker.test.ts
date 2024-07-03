import {
  storeQueryForObject,
  getQueryForObject,
  removeQueryForObjects
} from "../objectQueryTracker";

describe("objectQueryTracker", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("storeQueryForObject", () => {
    it("stores a query for an object", () => {
      const index = "myIndex";
      const objectID = "123";
      const queryID = "abc";

      storeQueryForObject(index, objectID, queryID);

      const storedQuery = JSON.parse(
        localStorage.getItem("AlgoliaObjectQueryCache_myIndex")!
      );

      expect(storedQuery).toEqual({
        [objectID]: [queryID, expect.any(Number)]
      });
    });

    it("stores multiple queries for objects", () => {
      const index = "myIndex";
      const objectID1 = "123";
      const objectID2 = "456";
      const queryID1 = "abc";
      const queryID2 = "def";

      storeQueryForObject(index, objectID1, queryID1);
      storeQueryForObject(index, objectID2, queryID2);

      const storedQuery = JSON.parse(
        localStorage.getItem("AlgoliaObjectQueryCache_myIndex")!
      );

      expect(storedQuery).toEqual({
        [objectID1]: [queryID1, expect.any(Number)],
        [objectID2]: [queryID2, expect.any(Number)]
      });
    });
  });

  describe("getQueryForObject", () => {
    it("returns undefined for a non-existent object query", () => {
      const index = "myIndex";
      const objectID = "123";

      const storedQuery = getQueryForObject(index, objectID);

      expect(storedQuery).toBeUndefined();
    });

    it("returns the latest query for an object", () => {
      const index = "myIndex";
      const objectID = "123";
      const queryID1 = "abc";
      const queryID2 = "def";

      storeQueryForObject(index, objectID, queryID1);
      storeQueryForObject(index, objectID, queryID2);

      const storedQuery = getQueryForObject(index, objectID);

      expect(storedQuery).toEqual([queryID2, expect.any(Number)]);
    });
  });

  describe("removeQueryForObject", () => {
    it("removes a query for an object", () => {
      const index = "myIndex";
      const objectID1 = "123";
      const objectID2 = "456";
      const queryID1 = "abc";
      const queryID2 = "def";

      storeQueryForObject(index, objectID1, queryID1);
      storeQueryForObject(index, objectID2, queryID2);

      const storedQuery = JSON.parse(
        localStorage.getItem("AlgoliaObjectQueryCache_myIndex")!
      );

      expect(storedQuery).toEqual({
        [objectID1]: [queryID1, expect.any(Number)],
        [objectID2]: [queryID2, expect.any(Number)]
      });

      removeQueryForObjects(index, [objectID1, objectID2]);

      const storedQueryAfterRemoval = JSON.parse(
        localStorage.getItem("AlgoliaObjectQueryCache_myIndex")!
      );

      expect(storedQueryAfterRemoval).toEqual({});
    });
  });
});

import {
  storeQueryForObject,
  getQueryForObject,
  removeQueryForObjects
} from "../objectQueryTracker";

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
const stored = () =>
  JSON.parse(localStorage.getItem("AlgoliaObjectQueryCache")!);

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

      expect(stored()).toEqual({
        [`${index}_${objectID}`]: [queryID, expect.any(Number)]
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

      expect(stored()).toEqual({
        [`${index}_${objectID1}`]: [queryID1, expect.any(Number)],
        [`${index}_${objectID2}`]: [queryID2, expect.any(Number)]
      });
    });

    it("removes the 1000 oldest query when the limit of 5000 is reached", async () => {
      const index = "myIndex";
      const oldestObjectID = "123";
      const newestObjectID = "456";
      const oldestQueryID = "abc";
      const newestQueryID = "def";

      storeQueryForObject(index, oldestObjectID, oldestQueryID);

      expect(getQueryForObject(index, oldestObjectID)).toEqual([
        oldestQueryID,
        expect.any(Number)
      ]);

      await wait(1);

      // synthetically generate 5000 entries
      const store = stored();
      for (let i = 0; i < 5000; i++) {
        store[`${index}_object${i}`] = [`query${i}`, Date.now()];
      }
      localStorage.setItem("AlgoliaObjectQueryCache", JSON.stringify(store));

      expect(Object.keys(stored())).toHaveLength(5001);

      await wait(1);

      storeQueryForObject(index, newestObjectID, newestQueryID);

      expect(Object.keys(stored())).toHaveLength(4001);
      expect(getQueryForObject(index, newestObjectID)).toEqual([
        newestQueryID,
        expect.any(Number)
      ]);
      expect(getQueryForObject(index, oldestObjectID)).toEqual(undefined);
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

      expect(stored()).toEqual({
        [`${index}_${objectID1}`]: [queryID1, expect.any(Number)],
        [`${index}_${objectID2}`]: [queryID2, expect.any(Number)]
      });

      removeQueryForObjects(index, [objectID1, objectID2]);

      expect(stored()).toEqual({});
    });
  });
});

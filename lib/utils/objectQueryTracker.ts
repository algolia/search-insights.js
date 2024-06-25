import { LocalStorage } from "./localStorage";

interface ObjectQueryMap {
  [objectId: string]: [queryId: string, timestamp: number];
}

const PREFIX = "AlgoliaObjectQueryCache_";

function getCache(index: string): ObjectQueryMap {
  return LocalStorage.get(`${PREFIX}${index}`) ?? {};
}
function setCache(index: string, objectQueryMap: ObjectQueryMap): void {
  LocalStorage.set(`${PREFIX}${index}`, objectQueryMap);
}

export function storeQueryForObject(
  index: string,
  objectID: string,
  queryID: string
): void {
  const objectQueryMap = getCache(index);

  objectQueryMap[objectID] = [queryID, Date.now()];
  setCache(index, objectQueryMap);
}

export function getQueryForObject(
  index: string,
  objectID: string
): [queryId: string, timestamp: number] | undefined {
  return getCache(index)[objectID];
}

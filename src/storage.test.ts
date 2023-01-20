import { Storage } from "./storage";

describe("Storage", () => {
  test("set string", () => {
    const item = "test";
    Storage.set("test", item);
    expect(Storage.get("test")).toEqual(item);
  });

  test("set object", () => {
    const item = { event: "test" };
    Storage.set("test", item);
    expect(Storage.get("test")).toEqual(item);
  });

  test("set array", () => {
    const item = [{ event: "test" }];
    Storage.set("test", item);
    expect(Storage.get("test")).toEqual(item);
  });
});

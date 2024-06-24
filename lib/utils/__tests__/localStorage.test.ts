import { LocalStorage } from "../localStorage";

const setItemMock = jest.spyOn(Object.getPrototypeOf(localStorage), "setItem");
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});
if (!global.navigator.storage) {
  (global.navigator as any).storage = {
    estimate: jest.fn()
  };
}
const storageEstimateMock = jest.spyOn(
  global.navigator.storage,
  "estimate" as any
);
storageEstimateMock.mockResolvedValue({
  usage: 0,
  quota: 100
});

describe("LocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("gets a value from localStorage", () => {
    const key = "testKey";
    const value = "testValue";
    localStorage.setItem(key, JSON.stringify(value));

    const result = LocalStorage.get(key);

    expect(result).toEqual(value);
  });

  it("returns null if the key is not found", () => {
    const key = "nonExistentKey";

    const result = LocalStorage.get(key);

    expect(result).toBeNull();
  });

  it("returns null if the value cannot be parsed as JSON", () => {
    const key = "testKey";
    const value = "invalidJSON";
    localStorage.setItem(key, value);

    const result = LocalStorage.get(key);

    expect(result).toBeNull();
  });

  it("sets a value in localStorage", () => {
    const key = "testKey";
    const value = "testValue";

    LocalStorage.set(key, value);

    const result = localStorage.getItem(key);
    expect(result).toEqual(JSON.stringify(value));
  });

  it("catches the error and logs an error if the storage is full", () => {
    const key = "testKey";
    const value = "testValue";

    // Emulate filling up the storage
    setItemMock.mockImplementationOnce(() => {
      throw new Error("pretend QuotaExceededError");
    });

    LocalStorage.set(key, value);

    const result = localStorage.getItem(key);
    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("removes a value from localStorage", () => {
    const key = "testKey";
    const value = "testValue";
    localStorage.setItem(key, JSON.stringify(value));

    LocalStorage.remove(key);

    const result = localStorage.getItem(key);
    expect(result).toBeNull();
  });

  it("checks if the storage is nearly full", async () => {
    expect(await LocalStorage.isNearlyFull()).toBe(false);

    storageEstimateMock.mockResolvedValueOnce({
      usage: 90,
      quota: 100
    });

    expect(await LocalStorage.isNearlyFull()).toBe(false);

    storageEstimateMock.mockResolvedValueOnce({
      usage: 91,
      quota: 100
    });

    expect(await LocalStorage.isNearlyFull()).toBe(true);
  });
});

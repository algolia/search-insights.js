/* eslint-disable max-classes-per-file */
import { LocalStorage } from "../localStorage";

const setItemMock = jest.spyOn(Object.getPrototypeOf(localStorage), "setItem");
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("LocalStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when localStorage is defined", () => {
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
  });

  describe("when localStorage is not defined", () => {
    class LocalStorageWithoutStore extends LocalStorage {}
    LocalStorageWithoutStore.store = undefined;

    it("doesn't throw errors", () => {
      expect(LocalStorageWithoutStore.get("testKey")).toBeNull();
      expect(() =>
        LocalStorageWithoutStore.set("testKey", "testValue")
      ).not.toThrow();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(() => LocalStorageWithoutStore.remove("testKey")).not.toThrow();
    });
  });

  describe("when localStorage is replaced", () => {
    const store = {
      getItem: jest.fn() as jest.MockedFn<Storage["getItem"]>,
      setItem: jest.fn() as jest.MockedFn<Storage["setItem"]>,
      removeItem: jest.fn() as jest.MockedFn<Storage["removeItem"]>,
      clear: jest.fn() as jest.MockedFn<Storage["clear"]>,
      key: jest.fn() as jest.MockedFn<Storage["key"]>,
      length: 50
    };
    class LocalStorageWithReplacedStore extends LocalStorage {}
    LocalStorageWithReplacedStore.store = store;

    it("gets a value from the localStorage replacement", () => {
      const key = "testKey";
      const value = "testValue";
      store.getItem.mockReturnValue(JSON.stringify(value));

      expect(LocalStorageWithReplacedStore.get(key)).toEqual(value);
      expect(
        LocalStorageWithReplacedStore.store?.getItem
      ).toHaveBeenCalledTimes(1);
      expect(LocalStorageWithReplacedStore.store?.getItem).toHaveBeenCalledWith(
        key
      );
    });

    it("returns null if the key is not found in the localStorage replacement", () => {
      const key = "nonExistentKey";
      store.getItem.mockReturnValue(null);

      expect(LocalStorageWithReplacedStore.get(key)).toBeNull();
    });

    it("returns null if the value from the localStorage replacement cannot be parsed as JSON", () => {
      const key = "testKey";
      const value = "invalidJSON";
      store.getItem.mockReturnValue(value);

      expect(LocalStorageWithReplacedStore.get(key)).toBeNull();
    });

    it("sets a value in the localStorage replacement", () => {
      const key = "testKey";
      const value = "testValue";

      LocalStorageWithReplacedStore.set(key, value);

      expect(
        LocalStorageWithReplacedStore.store?.setItem
      ).toHaveBeenCalledTimes(1);
      expect(LocalStorageWithReplacedStore.store?.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(value)
      );
    });

    it("removes a value from the localStorage replacement", () => {
      const key = "testKey";

      LocalStorageWithReplacedStore.remove(key);

      expect(
        LocalStorageWithReplacedStore.store?.removeItem
      ).toHaveBeenCalledTimes(1);
      expect(
        LocalStorageWithReplacedStore.store?.removeItem
      ).toHaveBeenCalledWith(key);
    });
  });
});

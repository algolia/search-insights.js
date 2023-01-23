import { EventEmitter } from "./eventEmitter";

describe("eventEmitter", () => {
  test("calling 'emit' before 'on' throws an error", async () => {
    const emitter = new EventEmitter();
    expect(() => emitter.emit("userToken:changed", "new-token")).toThrowError(
      new Error(
        `No event callbacks of type "userToken:changed" found. Register an event callback function with 'on' before calling 'emit'`
      )
    );
  });

  test("emit works", async () => {
    const emitter = new EventEmitter();
    const onUserTokenChange = jest.fn();
    const onUserTokenChange2 = jest.fn();
    const onUserTokenChange3 = jest.fn();

    emitter.on("userToken:changed", onUserTokenChange);
    emitter.on("userToken:changed", onUserTokenChange2);
    emitter.on("userToken:updated", onUserTokenChange3);
    emitter.emit("userToken:changed", "new-token");

    expect(onUserTokenChange).toHaveBeenCalledTimes(1);
    expect(onUserTokenChange.mock.lastCall).toEqual([
      "userToken:changed",
      "new-token"
    ]);

    expect(onUserTokenChange2).toHaveBeenCalledTimes(1);
    expect(onUserTokenChange2.mock.lastCall).toEqual([
      "userToken:changed",
      "new-token"
    ]);

    expect(onUserTokenChange3).toHaveBeenCalledTimes(0);
  });
});

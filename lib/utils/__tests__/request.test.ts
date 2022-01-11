import { describe, it, beforeEach, afterAll, expect, vi } from "vitest";
import { getRequesterForBrowser } from "../getRequesterForBrowser";

describe("request", () => {
  const sendBeaconBackup = navigator.sendBeacon;
  const XMLHttpRequestBackup = window.XMLHttpRequest;

  const sendBeacon = vi.fn(() => true);
  const open = vi.fn();
  const send = vi.fn();

  beforeEach(() => {
    sendBeacon.mockClear();
    open.mockClear();
    send.mockClear();

    navigator.sendBeacon = sendBeacon;
    // @ts-expect-error
    window.XMLHttpRequest = function (this: XMLHttpRequest) {
      this.open = open;
      this.send = send;
    };
  });

  afterAll(() => {
    navigator.sendBeacon = sendBeaconBackup;
    window.XMLHttpRequest = XMLHttpRequestBackup;
  });

  it("should pick sendBeacon first if available", () => {
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForBrowser();
    request(url, data);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);
    expect(navigator.sendBeacon).toHaveBeenLastCalledWith(
      url,
      JSON.stringify(data)
    );
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("should send with XMLHttpRequest if sendBeacon is not available", () => {
    // @ts-expect-error removing sendBeacon to mimic the environment that does not support sendBeacon
    navigator.sendBeacon = undefined;
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForBrowser();
    request(url, data);
    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenLastCalledWith("POST", url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
  });

  it("should fall back to XMLHttpRequest if sendBeacon returns false", () => {
    navigator.sendBeacon = vi.fn(() => false);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForBrowser();
    request(url, data);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);

    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenLastCalledWith("POST", url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
  });
});

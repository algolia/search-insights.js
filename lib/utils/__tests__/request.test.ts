import { request as nodeHttpRequest } from "http";
import { request as nodeHttpsRequest } from "https";

import {
  supportsSendBeacon,
  supportsXMLHttpRequest,
  supportsNodeHttpModule
} from "../featureDetection";
import { getRequesterForBrowser } from "../getRequesterForBrowser";
import { getRequesterForNode } from "../getRequesterForNode";

jest.mock("../featureDetection", () => ({
  __esModule: true,
  ...jest.requireActual("../featureDetection")
}));
jest.mock("http");
jest.mock("https");

describe("request", () => {
  const sendBeaconBackup = navigator.sendBeacon;
  const XMLHttpRequestBackup = window.XMLHttpRequest;

  const sendBeacon = jest.fn(() => true);
  const open = jest.fn();
  const send = jest.fn();
  const setRequestHeader = jest.fn();
  const write = jest.fn();
  const addEventListener = jest.fn((_, listener) => listener());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    navigator.sendBeacon = sendBeacon;

    // @ts-expect-error
    window.XMLHttpRequest = jest.fn(() => ({
      open,
      send,
      setRequestHeader,
      addEventListener,
      readyState: 4,
      status: 200
    }));

    nodeHttpRequest.mockImplementation((_: any, cb: any) => ({
      on: jest.fn(),
      write,
      end: () => cb({ statusCode: 200 })
    }));

    nodeHttpsRequest.mockImplementation((_: any, cb: any) => ({
      on: jest.fn(),
      write,
      end: () => cb({ statusCode: 200 })
    }));
  });

  afterAll(() => {
    navigator.sendBeacon = sendBeaconBackup;
    window.XMLHttpRequest = XMLHttpRequestBackup;
  });

  it("should pick sendBeacon first if available", async () => {
    supportsSendBeacon.mockImplementation(() => true);
    supportsXMLHttpRequest.mockImplementation(() => true);
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForBrowser();
    const sent = await request(url, data);
    expect(sent).toBe(true);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);
    expect(navigator.sendBeacon).toHaveBeenLastCalledWith(
      url,
      JSON.stringify(data)
    );
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
  });

  it("should send with XMLHttpRequest if sendBeacon is not available", async () => {
    supportsSendBeacon.mockImplementation(() => false);
    supportsXMLHttpRequest.mockImplementation(() => true);
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForBrowser();
    const sent = await request(url, data);
    expect(sent).toBe(true);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
    expect(setRequestHeader).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenLastCalledWith("POST", url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
  });

  it("should fall back to XMLHttpRequest if sendBeacon returns false", async () => {
    navigator.sendBeacon = jest.fn(() => false);
    supportsSendBeacon.mockImplementation(() => true);
    supportsXMLHttpRequest.mockImplementation(() => true);
    supportsNodeHttpModule.mockImplementation(() => false);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForBrowser();
    const sent = await request(url, data);
    expect(sent).toBe(true);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);

    expect(open).toHaveBeenCalledTimes(1);
    expect(setRequestHeader).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenLastCalledWith("POST", url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
  });

  it("should send with nodeHttpRequest if url does not start with https://", async () => {
    supportsSendBeacon.mockImplementation(() => false);
    supportsXMLHttpRequest.mockImplementation(() => false);
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "http://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    const sent = await request(url, data);
    expect(sent).toBe(true);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
    expect(nodeHttpRequest).toHaveBeenLastCalledWith(
      {
        protocol: "http:",
        host: "random.url",
        path: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": JSON.stringify(data).length
        }
      },
      expect.any(Function)
    );
    expect(nodeHttpRequest).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("should send with nodeHttpsRequest if url starts with https://", async () => {
    supportsSendBeacon.mockImplementation(() => false);
    supportsXMLHttpRequest.mockImplementation(() => false);
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    const sent = await request(url, data);
    expect(sent).toBe(true);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).toHaveBeenLastCalledWith(
      {
        protocol: "https:",
        host: "random.url",
        path: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": JSON.stringify(data).length
        }
      },
      expect.any(Function)
    );
    expect(nodeHttpsRequest).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });

  it.each([
    { browser: true, beacon: true, url: "http://random.url" },
    { browser: true, beacon: false, url: "http://random.url" },
    { browser: false, beacon: false, url: "http://random.url" },
    { browser: false, beacon: false, url: "https://random.url" }
  ])(
    "should return false on non-200 response for %o",
    async ({ browser, beacon, url }) => {
      // @ts-expect-error
      window.XMLHttpRequest.mockImplementation(() => ({
        open,
        send,
        setRequestHeader,
        addEventListener,
        readyState: 4,
        status: 400
      }));
      (nodeHttpRequest as jest.Mock).mockImplementation((_, cb) => ({
        on: jest.fn(),
        write,
        end: () => cb({ statusCode: 400 })
      }));
      (nodeHttpsRequest as jest.Mock).mockImplementation((_, cb) => ({
        on: jest.fn(),
        write,
        end: () => cb({ statusCode: 400 })
      }));

      supportsSendBeacon.mockImplementation(() => beacon);
      supportsXMLHttpRequest.mockImplementation(() => true);
      supportsNodeHttpModule.mockImplementation(() => true);

      const data = { foo: "bar" };
      const request = browser
        ? getRequesterForBrowser()
        : getRequesterForNode();
      const sent = await request(url, data);
      expect(sent).toBe(false);
    }
  );
});

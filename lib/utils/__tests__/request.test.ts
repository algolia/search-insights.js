// @ts-ignore
import {
  supportsSendBeacon,
  supportsXMLHttpRequest,
  supportsNodeHttpModule
} from "../featureDetection";

const supportsSendBeaconMock = jest.fn();
const supportsXMLHttpRequestMock = jest.fn();
const supportsNodeHttpModuleMock = jest.fn();

jest.mock("../featureDetection", () => ({
  supportsSendBeacon: supportsSendBeaconMock,
  supportsXMLHttpRequest: supportsXMLHttpRequestMock,
  supportsNodeHttpModule: supportsNodeHttpModuleMock,
  __esModule: true
}));

// @ts-ignore
import https from "https";

const nodeHttpsRequestMock = jest.fn();

jest.mock("https", () => ({
  request: nodeHttpsRequestMock
}));

// @ts-ignore
import http from "http";

const nodeHttpRequestMock = jest.fn();

jest.mock("http", () => ({
  request: nodeHttpRequestMock
}));

import { getRequesterForBrowser } from "../getRequesterForBrowser";
import { getRequesterForNode } from "../getRequesterForNode";

describe("request", () => {
  const sendBeacon = jest.fn(() => true);
  const open = jest.fn();
  const send = jest.fn();
  const setRequestHeader = jest.fn();
  const addEventListener = jest.fn();
  const write = jest.fn();

  const sendBeaconBackup = navigator.sendBeacon;
  const XMLHttpRequestBackup = window.XMLHttpRequest;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    navigator.sendBeacon = sendBeacon;
    // @ts-ignore
    window.XMLHttpRequest = function () {
      this.open = open;
      this.send = send;
      this.setRequestHeader = setRequestHeader;
      this.addEventListener = addEventListener;
    };
    nodeHttpRequestMock.mockImplementation(() => {
      return {
        write,
        on: jest.fn(),
        end: jest.fn()
      };
    });
    nodeHttpsRequestMock.mockImplementation(() => {
      return {
        write,
        on: jest.fn(),
        end: jest.fn()
      };
    });
  });

  afterAll(() => {
    navigator.sendBeacon = sendBeaconBackup;
    window.XMLHttpRequest = XMLHttpRequestBackup;
  });

  it("should pick sendBeacon first if available", () => {
    supportsSendBeaconMock.mockImplementation(() => true);
    supportsXMLHttpRequestMock.mockImplementation(() => true);
    supportsNodeHttpModuleMock.mockImplementation(() => true);
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
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(addEventListener).not.toHaveBeenCalled();
    expect(nodeHttpRequestMock).not.toHaveBeenCalled();
    expect(nodeHttpsRequestMock).not.toHaveBeenCalled();
  });

  it("should send with XMLHttpRequest if sendBeacon is not available", () => {
    supportsSendBeaconMock.mockImplementation(() => false);
    supportsXMLHttpRequestMock.mockImplementation(() => true);
    supportsNodeHttpModuleMock.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForBrowser();
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
    expect(setRequestHeader).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenLastCalledWith("POST", url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(nodeHttpRequestMock).not.toHaveBeenCalled();
    expect(nodeHttpsRequestMock).not.toHaveBeenCalled();
  });

  it("should fall back to XMLHttpRequest if sendBeacon returns false", () => {
    navigator.sendBeacon = jest.fn(() => false);
    supportsSendBeaconMock.mockImplementation(() => true);
    supportsXMLHttpRequestMock.mockImplementation(() => true);
    supportsNodeHttpModuleMock.mockImplementation(() => false);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForBrowser();
    request(url, data);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);

    expect(open).toHaveBeenCalledTimes(1);
    expect(setRequestHeader).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenLastCalledWith("POST", url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(nodeHttpRequestMock).not.toHaveBeenCalled();
    expect(nodeHttpsRequestMock).not.toHaveBeenCalled();
  });

  it("should send with nodeHttpRequest if url does not start with https://", () => {
    supportsSendBeaconMock.mockImplementation(() => false);
    supportsXMLHttpRequestMock.mockImplementation(() => false);
    supportsNodeHttpModuleMock.mockImplementation(() => true);
    const url = "http://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(nodeHttpsRequestMock).not.toHaveBeenCalled();
    expect(nodeHttpRequestMock).toHaveBeenLastCalledWith({
      protocol: "http:",
      host: "random.url",
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(data).length
      }
    });
    expect(nodeHttpRequestMock).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("should send with nodeHttpsRequest if url starts with https://", () => {
    supportsSendBeaconMock.mockImplementation(() => false);
    supportsXMLHttpRequestMock.mockImplementation(() => false);
    supportsNodeHttpModuleMock.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(nodeHttpRequestMock).not.toHaveBeenCalled();
    expect(nodeHttpsRequestMock).toHaveBeenLastCalledWith({
      protocol: "https:",
      host: "random.url",
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(data).length
      }
    });
    expect(nodeHttpsRequestMock).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });
});

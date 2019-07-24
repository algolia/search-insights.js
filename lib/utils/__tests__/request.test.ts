import { request as nodeHttpRequest } from "http";
import { request as nodeHttpsRequest } from "https";
import request from "../request";
import {
  supportsSendBeacon,
  supportsXMLHttpRequest,
  supportsNodeHttpModule
} from "../featureDetection";
jest.mock("../featureDetection");
jest.mock("http");
jest.mock("https");

describe("request", () => {
  const sendBeaconBackup = navigator.sendBeacon;
  const XMLHttpRequestBackup = window.XMLHttpRequest;

  const sendBeacon = jest.fn();
  const open = jest.fn();
  const send = jest.fn();
  const write = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    navigator.sendBeacon = sendBeacon;
    window.XMLHttpRequest = function() {
      this.open = open;
      this.send = send;
    };
    nodeHttpRequest.mockImplementation(() => {
      return {
        on: jest.fn(),
        write,
        end: jest.fn()
      };
    });
    nodeHttpsRequest.mockImplementation(() => {
      return {
        on: jest.fn(),
        write,
        end: jest.fn()
      };
    });
  });

  afterAll(() => {
    navigator.sendBeacon = sendBeaconBackup;
    window.XMLHttpRequest = XMLHttpRequestBackup;
  });

  it("should pick sendBeacon first if available", () => {
    supportsSendBeacon.mockImplementation(() => true);
    supportsXMLHttpRequest.mockImplementation(() => true);
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    request(url, data);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);
    expect(navigator.sendBeacon).toHaveBeenLastCalledWith(
      url,
      JSON.stringify(data)
    );
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
  });

  it("should send with XMLHttpRequest", () => {
    supportsSendBeacon.mockImplementation(() => false);
    supportsXMLHttpRequest.mockImplementation(() => true);
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenLastCalledWith("POST", url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
  });

  it("should send with nodeHttpRequest", () => {
    supportsSendBeacon.mockImplementation(() => false);
    supportsXMLHttpRequest.mockImplementation(() => false);
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "http://random.url";
    const data = { foo: "bar" };
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
    expect(nodeHttpRequest).toHaveBeenCalledTimes(1);
    expect(nodeHttpRequest).toHaveBeenLastCalledWith(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(data).length
      }
    });
    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
  });

  it("should send with nodeHttpsRequest", () => {
    supportsSendBeacon.mockImplementation(() => false);
    supportsXMLHttpRequest.mockImplementation(() => false);
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).toHaveBeenCalledTimes(1);
    expect(nodeHttpsRequest).toHaveBeenLastCalledWith(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(data).length
      }
    });
    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
  });
});

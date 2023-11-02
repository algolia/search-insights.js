import type { RequestOptions as httpRequestOptions } from "http";
import { ClientRequest, request as httpRequest, IncomingMessage } from "http";
import type { RequestOptions as httpsRequestOptions } from "https";
import { request as httpsRequest } from "https";
import { Socket } from "net";

import {
  supportsSendBeacon,
  supportsXMLHttpRequest,
  supportsNodeHttpModule,
  supportsNativeFetch
} from "../featureDetection";
import { getRequesterForBrowser } from "../getRequesterForBrowser";
import { getRequesterForNode } from "../getRequesterForNode";

// In the tests, we want to mock a specific overload of request so we need to
// cast it to the correct type.
type HttpRequestOverload = (
  options: httpRequestOptions | URL | string,
  callback?: (res: IncomingMessage) => void
) => ClientRequest;

type HttpsRequestOverload = (
  options: httpsRequestOptions | URL | string,
  callback?: (res: IncomingMessage) => void
) => ClientRequest;

jest.mock("../featureDetection");
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

    jest
      .mocked(httpRequest as unknown as jest.Mocked<HttpRequestOverload>)
      .mockImplementation(
        (
          _: httpRequestOptions | URL | string,
          cb?: (res: IncomingMessage) => void
        ) => {
          const req = new ClientRequest("/dummy");
          req.on = jest.fn();
          req.write = write;
          req.end = () => {
            if (cb) {
              const res = new IncomingMessage(new Socket());
              res.statusCode = 200;
              cb(res);
            }
            return req;
          };
          return req;
        }
      );

    jest
      .mocked(httpsRequest as unknown as jest.Mocked<HttpsRequestOverload>)
      .mockImplementation(
        (
          _: httpsRequestOptions | URL | string,
          cb?: (res: IncomingMessage) => void
        ) => {
          const req = new ClientRequest("/dummy");
          req.on = jest.fn();
          req.write = write;
          req.end = () => {
            if (cb) {
              const res = new IncomingMessage(new Socket());
              res.statusCode = 200;
              cb(res);
            }
            return req;
          };
          return req;
        }
      );
  });

  afterAll(() => {
    navigator.sendBeacon = sendBeaconBackup;
    window.XMLHttpRequest = XMLHttpRequestBackup;
  });

  it("should pick sendBeacon first if available", async () => {
    jest.mocked(supportsSendBeacon).mockImplementation(() => true);
    jest.mocked(supportsXMLHttpRequest).mockImplementation(() => true);
    jest.mocked(supportsNodeHttpModule).mockImplementation(() => true);
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
    expect(httpRequest).not.toHaveBeenCalled();
    expect(httpsRequest).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should send with XMLHttpRequest if sendBeacon is not available", async () => {
    jest.mocked(supportsSendBeacon).mockImplementation(() => false);
    jest.mocked(supportsXMLHttpRequest).mockImplementation(() => true);
    jest.mocked(supportsNodeHttpModule).mockImplementation(() => true);
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
    expect(httpRequest).not.toHaveBeenCalled();
    expect(httpsRequest).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should fall back to XMLHttpRequest if sendBeacon returns false", async () => {
    navigator.sendBeacon = jest.fn(() => false);
    jest.mocked(supportsSendBeacon).mockImplementation(() => true);
    jest.mocked(supportsXMLHttpRequest).mockImplementation(() => true);
    jest.mocked(supportsNodeHttpModule).mockImplementation(() => false);
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
    expect(httpRequest).not.toHaveBeenCalled();
    expect(httpsRequest).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should send with nodeHttpRequest if url does not start with https://", async () => {
    jest.mocked(supportsSendBeacon).mockImplementation(() => false);
    jest.mocked(supportsXMLHttpRequest).mockImplementation(() => false);
    jest.mocked(supportsNodeHttpModule).mockImplementation(() => true);
    const url = "http://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    const sent = await request(url, data);
    expect(sent).toBe(true);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(httpsRequest).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(httpRequest).toHaveBeenLastCalledWith(
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
    expect(httpRequest).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("should send with nodeHttpsRequest if url starts with https://", async () => {
    jest.mocked(supportsSendBeacon).mockImplementation(() => false);
    jest.mocked(supportsXMLHttpRequest).mockImplementation(() => false);
    jest.mocked(supportsNodeHttpModule).mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    const sent = await request(url, data);
    expect(sent).toBe(true);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(httpRequest).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(httpsRequest).toHaveBeenLastCalledWith(
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
    expect(httpsRequest).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("should send with fetch if nodeHttpRequest is not available", async () => {
    jest.mocked(supportsSendBeacon).mockImplementation(() => false);
    jest.mocked(supportsXMLHttpRequest).mockImplementation(() => false);
    jest.mocked(supportsNodeHttpModule).mockImplementation(() => false);
    jest.mocked(supportsNativeFetch).mockImplementation(() => true);

    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    const sent = await request(url, data);
    expect(sent).toBe(true);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(httpRequest).not.toHaveBeenCalled();
    expect(httpsRequest).not.toHaveBeenCalled();

    expect(fetch).toHaveBeenCalledWith("https://random.url", {
      body: '{"foo":"bar"}',
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
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

      jest
        .mocked(httpRequest as unknown as jest.Mocked<HttpRequestOverload>)
        .mockImplementation(
          (
            _: httpRequestOptions | URL | string,
            cb?: (res: IncomingMessage) => void
          ) => {
            const req = new ClientRequest("/dummy");
            req.on = jest.fn();
            req.write = write;
            req.end = () => {
              if (cb) {
                const res = new IncomingMessage(new Socket());
                res.statusCode = 400;
                cb(res);
              }
              return req;
            };
            return req;
          }
        );

      jest
        .mocked(httpsRequest as unknown as jest.Mocked<HttpsRequestOverload>)
        .mockImplementation(
          (
            _: httpsRequestOptions | URL | string,
            cb?: (res: IncomingMessage) => void
          ) => {
            const req = new ClientRequest("/dummy");
            req.on = jest.fn();
            req.write = write;
            req.end = () => {
              if (cb) {
                const res = new IncomingMessage(new Socket());
                res.statusCode = 400;
                cb(res);
              }
              return req;
            };
            return req;
          }
        );

      jest.mocked(supportsSendBeacon).mockImplementation(() => beacon);
      jest.mocked(supportsXMLHttpRequest).mockImplementation(() => true);
      jest.mocked(supportsNodeHttpModule).mockImplementation(() => true);

      const data = { foo: "bar" };
      const request = browser
        ? getRequesterForBrowser()
        : getRequesterForNode();
      const sent = await request(url, data);
      expect(sent).toBe(false);
    }
  );
});

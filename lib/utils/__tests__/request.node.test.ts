import { jest } from "@jest/globals";
import http from "http";
import https from "https";
import { getRequesterForNode } from "../getRequesterForNode";
import { supportsNodeHttpModule } from "../featureDetection";

const nodeHttpRequest = http.request;
const nodeHttpsRequest = https.request;

jest.mock("../featureDetection");
jest.mock("http");
jest.mock("https");

describe("request", () => {
  const write = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
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

  it("should send with nodeHttpRequest if url does not start with https://", () => {
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "http://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    request(url, data);
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
    expect(nodeHttpRequest).toHaveBeenLastCalledWith({
      protocol: "http:",
      host: "random.url",
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(data).length
      }
    });
    expect(nodeHttpRequest).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("should send with nodeHttpsRequest if url starts with https://", () => {
    supportsNodeHttpModule.mockImplementation(() => true);
    const url = "https://random.url";
    const data = { foo: "bar" };
    const request = getRequesterForNode();
    request(url, data);
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).toHaveBeenLastCalledWith({
      protocol: "https:",
      host: "random.url",
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(data).length
      }
    });
    expect(nodeHttpsRequest).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });
});

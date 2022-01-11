import { describe, it, beforeAll, expect, vi, beforeEach } from "vitest";
import http from "http";
import https from "https";
import { getNodeHttpModule } from "../getNodeHttpModule";
import { requestWithNodeHttpModule } from "../request";

vi.mock("../getNodeHttpModule");

describe("request", () => {
  const write = vi.fn();

  beforeAll(() => {
    vi.spyOn(http, "request").mockImplementation(() => {
      return {
        on: vi.fn(),
        write,
        end: vi.fn()
      };
    });

    vi.spyOn(https, "request").mockImplementation(() => {
      return {
        on: vi.fn(),
        write,
        end: vi.fn()
      };
    });
  });

  beforeEach(() => {
    write.mockClear();
    vi.mocked(http.request).mockClear();
    vi.mocked(https.request).mockClear();
  });

  it("should send with nodeHttpRequest if url does not start with https://", () => {
    const url = "http://random.url";
    const data = { foo: "bar" };
    vi.mocked(getNodeHttpModule).mockImplementation(() => http);
    requestWithNodeHttpModule(url, data);
    expect(https.request).not.toHaveBeenCalled();
    expect(http.request).toHaveBeenLastCalledWith({
      protocol: "http:",
      host: "random.url",
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(data).length
      }
    });
    expect(http.request).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("should send with nodeHttpsRequest if url starts with https://", () => {
    const url = "https://random.url";
    const data = { foo: "bar" };
    vi.mocked(getNodeHttpModule).mockImplementation(() => https);
    requestWithNodeHttpModule(url, data);
    expect(http.request).not.toHaveBeenCalled();
    expect(https.request).toHaveBeenLastCalledWith({
      protocol: "https:",
      host: "random.url",
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(data).length
      }
    });
    expect(https.request).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });
});

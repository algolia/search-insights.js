import AlgoliaAnalytics from "../insights";
import { getFunctionalInterface } from "../_getFunctionalInterface";
import {
  requestWithSendBeacon,
  requestWithXMLHttpRequest,
  requestWithNodeHttpModule
} from "../utils/request";
require("dotenv").config();

const payload = {
  eventType: "click",
  eventName: "hit-clicked",
  userToken: "user-id-1",
  index: "instant_search",
  queryID: "ebdfbbdd3fba888026416515c26d7954",
  objectIDs: ["3828012"],
  positions: [2]
};

describe("AlgoliaAnalytics - callback", () => {
  describe("sendBeacon", () => {
    beforeEach(() => {
      navigator.sendBeacon = jest.fn();
    });

    it("calls the callback with no result", done => {
      const insightsClient = new AlgoliaAnalytics({
        requestFn: requestWithSendBeacon
      });
      const aa = getFunctionalInterface(insightsClient);
      aa("init", {
        appId: process.env.APP_ID,
        apiKey: process.env.API_KEY
      });
      aa("clickedObjectIDsAfterSearch", payload, (error, result) => {
        expect(error).toBeUndefined();
        expect(result).toBeUndefined();
        done();
      });
    });

    it("calls the callback with no error from wrong credentials", done => {
      const insightsClient = new AlgoliaAnalytics({
        requestFn: requestWithSendBeacon
      });
      const aa = getFunctionalInterface(insightsClient);
      aa("init", {
        appId: "wrong-app-id",
        apiKey: "wrong-api-key"
      });
      aa("clickedObjectIDsAfterSearch", payload, (error, result) => {
        expect(result).toBeUndefined();
        expect(error).toBeUndefined();
        done();
      });
    });
  });

  describe("XMLHttpRequest", () => {
    it("calls the callback with result", done => {
      const insightsClient = new AlgoliaAnalytics({
        requestFn: requestWithXMLHttpRequest
      });
      const aa = getFunctionalInterface(insightsClient);
      aa("init", {
        appId: process.env.APP_ID,
        apiKey: process.env.API_KEY
      });
      aa("clickedObjectIDsAfterSearch", payload, (error, result) => {
        expect(error).toBeNull();
        expect(result).toEqual('{"status":200,"message":"OK"}');
        done();
      });
    });

    it("calls the callback with error from wrong credentials", done => {
      const insightsClient = new AlgoliaAnalytics({
        requestFn: requestWithXMLHttpRequest
      });
      const aa = getFunctionalInterface(insightsClient);
      aa("init", {
        appId: "wrong-app-id",
        apiKey: "wrong-api-key"
      });
      aa("clickedObjectIDsAfterSearch", payload, (error, result) => {
        expect(result).toBeUndefined();
        expect(error).toEqual({
          responseText: '{"status":401,"message":"Invalid credentials"}',
          status: 401,
          statusText: "Unauthorized"
        });
        done();
      });
    });

    it("calls the callback with error from wrong endpoint", done => {
      const insightsClient = new AlgoliaAnalytics({
        requestFn: requestWithXMLHttpRequest
      });
      const aa = getFunctionalInterface(insightsClient);
      aa("init", {
        appId: "wrong-app-id",
        apiKey: "wrong-api-key"
      });
      insightsClient._endpointOrigin = "https://not_existing_domain!!!.com";
      aa("clickedObjectIDsAfterSearch", payload, (error, result) => {
        expect(result).toBeUndefined();
        expect(error).toEqual({ responseText: "", status: 0, statusText: "" });
        done();
      });
    });
  });

  describe("node http/https", () => {
    it("calls the callback with result", done => {
      const insightsClient = new AlgoliaAnalytics({
        requestFn: requestWithNodeHttpModule
      });
      const aa = getFunctionalInterface(insightsClient);
      aa("init", {
        appId: process.env.APP_ID,
        apiKey: process.env.API_KEY
      });
      aa("clickedObjectIDsAfterSearch", payload, (error, result) => {
        expect(error).toBeNull();
        expect(result).toEqual('{"status":200,"message":"OK"}');
        done();
      });
    });

    it("calls the callback with error from wrong credentials", done => {
      const insightsClient = new AlgoliaAnalytics({
        requestFn: requestWithNodeHttpModule
      });
      const aa = getFunctionalInterface(insightsClient);
      aa("init", {
        appId: "wrong-app-id",
        apiKey: "wrong-api-key"
      });
      aa("clickedObjectIDsAfterSearch", payload, (error, result) => {
        expect(result).toBeUndefined();
        expect(error).toEqual({
          responseText: '{"status":401,"message":"Invalid credentials"}',
          status: 401,
          statusText: "Unauthorized"
        });
        done();
      });
    });

    it("calls the callback with error from wrong endpoint", done => {
      const insightsClient = new AlgoliaAnalytics({
        requestFn: requestWithNodeHttpModule
      });
      const aa = getFunctionalInterface(insightsClient);
      aa("init", {
        appId: "wrong-app-id",
        apiKey: "wrong-api-key"
      });
      insightsClient._endpointOrigin = "https://not_existing_domain!!!.com";
      aa("clickedObjectIDsAfterSearch", payload, (error, result) => {
        expect(result).toBeUndefined();
        expect(error).toEqual(
          expect.objectContaining({
            errno: "ENOTFOUND",
            code: "ENOTFOUND",
            syscall: "getaddrinfo",
            hostname: "not_existing_domain"
          })
        );
        done();
      });
    });
  });
});

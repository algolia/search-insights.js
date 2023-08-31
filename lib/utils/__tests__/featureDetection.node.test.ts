/**
 * @jest-environment node
 */

import {
  supportsCookies,
  supportsSendBeacon,
  supportsXMLHttpRequest,
  supportsNodeHttpModule,
} from "../featureDetection";

describe("featureDetection in node env", () => {
  describe("supportsCookies", () => {
    it("returns false", () => {
      // it is not available in node env
      expect(supportsCookies()).toBe(false);
    });
  });

  describe("supportsSendBeacon", () => {
    it("should return false", () => {
      // it is not available in node env
      expect(supportsSendBeacon()).toBe(false);
    });
  });

  describe("supportsXMLHttpRequest", () => {
    it("should return false", () => {
      // it is not available in node env
      expect(supportsXMLHttpRequest()).toBe(false);
    });
  });

  describe("supportsNodeHttpModule", () => {
    it("should return true", () => {
      // it is available in node env
      expect(supportsNodeHttpModule()).toBe(true);
    });
  });
});

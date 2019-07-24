/**
 * @jest-environment node
 */

import { supportsCookies } from "../featureDetection";

describe("featureDetection in node env", () => {
  describe("supportsCookies", () => {
    it("returns false", () => {
      expect(supportsCookies()).toBe(false);
    });
  });
});

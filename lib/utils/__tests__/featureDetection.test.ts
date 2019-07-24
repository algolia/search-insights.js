import { supportsCookies } from "../featureDetection";

describe("featureDetection", () => {
  describe("supportsCookies", () => {
    it("returns true in jsdom env", () => {
      expect(supportsCookies()).toBe(true);
    });
  });
});

import { userToken } from "../_cookieUtils";
jest.mock("../utils/index", () => ({
  createUUID: jest.fn(() => "mock-uuid")
}));

describe("cookieUtils", () => {
  // FIXME document.cookie should be fully mocked
  // getCookie and setCookie should be put in utils and mocked in this test
  describe("userToken", () => {
    it("should create a cookie with a UUID", () => {
      delete document.cookie;
      userToken(null, 1000);
      expect(document.cookie).toBe("_ALGOLIA=mock-uuid");
    });
  });
});

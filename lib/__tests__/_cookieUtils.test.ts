import { getCookie } from "../_cookieUtils";

const DAY = 86400000; /* 1 day in ms*/
const DATE_TOMORROW = new Date(Date.now() + DAY).toUTCString();
const DATE_YESTERDAY = new Date(Date.now() - DAY).toUTCString();

describe("cookieUtils", () => {
  beforeEach(() => {
    // clean _ALGOLIA cookie
    // the only way to clean a cookie is by setting it to a passed date.
    document.cookie = `_ALGOLIA=value;expires=${DATE_YESTERDAY};path=/`;
  });
  describe("getCookie", () => {
    it("should return '' _ALGOLIA cookie when not available", () => {
      expect(getCookie("_ALGOLIA")).toEqual("");
    });
    it("should get _ALGOLIA cookie when available", () => {
      document.cookie = `_ALGOLIA=value;expires=${DATE_TOMORROW};path=/`;

      expect(getCookie("_ALGOLIA")).toEqual("value");
    });
    it("should not care about other cookie if malformed", () => {
      document.cookie = `_ALGOLIA=value;expires=${DATE_TOMORROW};path=/`;
      document.cookie = `BAD_COOKIE=val%ue;expires=${DATE_TOMORROW};path=/`;

      expect(getCookie("_ALGOLIA")).toEqual("value");
    });
  });
});

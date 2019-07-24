import AlgoliaInsights from "../insights";
import * as utils from "../utils";

describe("init", () => {
  it("should throw if no parameters is passed", () => {
    expect(() => {
      (AlgoliaInsights as any).init();
    }).toThrowErrorMatchingInlineSnapshot(
      `"Init function should be called with an object argument containing your apiKey and appId"`
    );
  });
  it("should throw if apiKey is not sent", () => {
    expect(() => {
      (AlgoliaInsights as any).init({ appId: "***" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"apiKey is missing, please provide it so we can authenticate the application"`
    );
  });
  it("should throw if appId is not sent", () => {
    expect(() => {
      (AlgoliaInsights as any).init({ apiKey: "***" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"appId is missing, please provide it, so we can properly attribute data to your application"`
    );
  });
  it("should throw if region is other than `de` | `us`", () => {
    expect(() => {
      (AlgoliaInsights as any).init({
        appId: "xxx",
        apiKey: "***",
        region: "emea"
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"optional region is incorrect, please provide either one of: de, us."`
    );
  });
  it("should set _appId on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", appId: "XXX" });
    expect(AlgoliaInsights._appId).toBe("XXX");
  });
  it("should set _apiKey on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", appId: "XXX" });
    expect(AlgoliaInsights._apiKey).toBe("***");
  });
  it("should set _region on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", appId: "XXX", region: "us" });
    expect(AlgoliaInsights._region).toBe("us");
  });
  it("should set _userHasOptedOut on instance to false by default", () => {
    AlgoliaInsights.init({ apiKey: "***", appId: "XXX" });
    expect(AlgoliaInsights._userHasOptedOut).toBe(false);
  });
  it("should set _userHasOptedOut on instance when passed", () => {
    AlgoliaInsights.init({
      apiKey: "***",
      appId: "XXX",
      userHasOptedOut: true
    });
    expect(AlgoliaInsights._userHasOptedOut).toBe(true);
  });
  it("should use 6 months cookieDuration by default", () => {
    AlgoliaInsights.init({ apiKey: "***", appId: "XXX" });
    const month = 30 * 24 * 60 * 60 * 1000;
    expect(AlgoliaInsights._cookieDuration).toBe(6 * month);
  });
  it.each(["not a string", 0.002, NaN])(
    "should throw if cookieDuration passed but is not an integer (eg. %s)",
    cookieDuration => {
      expect(() => {
        (AlgoliaInsights as any).init({
          cookieDuration,
          apiKey: "***",
          appId: "XXX"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"optional cookieDuration is incorrect, expected an integer."`
      );
    }
  );
  it("should use passed cookieDuration", () => {
    AlgoliaInsights.init({
      apiKey: "***",
      appId: "XXX",
      cookieDuration: 42
    });
    expect(AlgoliaInsights._cookieDuration).toBe(42);
  });
  it("should set _endpointOrigin on instance to https://insights.algolia.io", () => {
    AlgoliaInsights.init({ apiKey: "***", appId: "XXX" });
    expect(AlgoliaInsights._endpointOrigin).toBe("https://insights.algolia.io");
  });
  it("should set _endpointOrigin on instance to https://insights.us.algolia.io if region === 'us'", () => {
    AlgoliaInsights.init({ apiKey: "***", appId: "XXX", region: "us" });
    expect(AlgoliaInsights._endpointOrigin).toBe(
      "https://insights.us.algolia.io"
    );
  });
  it("should set _endpointOrigin on instance to https://insights.de.algolia.io if region === 'de'", () => {
    AlgoliaInsights.init({ apiKey: "***", appId: "XXX", region: "de" });
    expect(AlgoliaInsights._endpointOrigin).toBe(
      "https://insights.de.algolia.io"
    );
  });
  it("should set userToken to ANONYMOUS if environment supports cookies", () => {
    const supportsCookies = jest
      .spyOn(utils, "supportsCookies")
      .mockReturnValue(true);
    const setUserToken = jest.spyOn(AlgoliaInsights, "setUserToken");

    AlgoliaInsights.init({ apiKey: "***", appId: "XXX", region: "de" });
    expect(setUserToken).toHaveBeenCalledWith(
      AlgoliaInsights.ANONYMOUS_USER_TOKEN
    );

    setUserToken.mockRestore();
    supportsCookies.mockRestore();
  });
  it("should not set userToken if environment does not supports cookies", () => {
    const supportsCookies = jest
      .spyOn(utils, "supportsCookies")
      .mockReturnValue(false);
    const setUserToken = jest.spyOn(AlgoliaInsights, "setUserToken");

    AlgoliaInsights.init({ apiKey: "***", appId: "XXX", region: "de" });
    expect(setUserToken).not.toHaveBeenCalled();

    setUserToken.mockRestore();
    supportsCookies.mockRestore();
  });
});

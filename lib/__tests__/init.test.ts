import AlgoliaInsights from "../insights";
import { userToken } from "../_cookieUtils";
jest.mock("../_cookieUtils", () => ({ userToken: jest.fn() }));

describe("init", () => {
  beforeEach(() => {
    userToken.mockClear();
  });
  it("should throw if no parameters is passed", () => {
    expect(() => {
      (AlgoliaInsights as any).init();
    }).toThrowErrorMatchingInlineSnapshot(
      `"Init function should be called with an object argument containing your apiKey and applicationID"`
    );
  });
  it("should throw if apiKey is not sent", () => {
    expect(() => {
      (AlgoliaInsights as any).init({ applicationID: "***" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"apiKey is missing, please provide it so we can authenticate the application"`
    );
  });
  it("should throw if applicationID is not sent", () => {
    expect(() => {
      (AlgoliaInsights as any).init({ apiKey: "***" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"applicationID is missing, please provide it, so we can properly attribute data to your application"`
    );
  });
  it("should throw if region is other than `de` | `us`", () => {
    expect(() => {
      (AlgoliaInsights as any).init({
        applicationID: "xxx",
        apiKey: "***",
        region: "emea"
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"optional region is incorrect, please provide either one of: de, us."`
    );
  });
  it("should set _applicationID on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX" });
    expect(AlgoliaInsights._applicationID).toBe("XXX");
  });
  it("should set _apiKey on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX" });
    expect(AlgoliaInsights._apiKey).toBe("***");
  });
  it("should set _region on instance", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX", region: "us" });
    expect(AlgoliaInsights._region).toBe("us");
  });
  it("should set _userHasOptedOut on instance to false by default", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX" });
    expect(AlgoliaInsights._userHasOptedOut).toBe(false);
  });
  it("should set _userHasOptedOut on instance when passed", () => {
    AlgoliaInsights.init({
      apiKey: "***",
      applicationID: "XXX",
      userHasOptedOut: true
    });
    expect(AlgoliaInsights._userHasOptedOut).toBe(true);
  });
  it("should use 6 months cookieDuration by default", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX" });
    const month = 30 * 24 * 60 * 60 * 1000;
    expect(userToken).toHaveBeenCalledTimes(1);
    expect(userToken.mock.calls[0][1]).toBe(6 * month);
  });
  it.each(["not a string", 0.002, NaN])(
    "should throw if cookieDuration passed but is not an integer (eg. %s)",
    cookieDuration => {
      expect(() => {
        (AlgoliaInsights as any).init({
          cookieDuration,
          apiKey: "***",
          applicationID: "XXX"
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"optional cookieDuration is incorrect, expected an integer"`
      );
    }
  );
  it("should use passed cookieDuration", () => {
    AlgoliaInsights.init({
      apiKey: "***",
      applicationID: "XXX",
      cookieDuration: 42
    });
    expect(userToken).toHaveBeenCalledTimes(1);
    expect(userToken.mock.calls[0][1]).toBe(42);
  });
  it("should set _endpointOrigin on instance to https://insights.algolia.io", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX" });
    expect(AlgoliaInsights._endpointOrigin).toBe("https://insights.algolia.io");
  });
  it("should set _endpointOrigin on instance to https://insights.us.algolia.io if region === 'us'", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX", region: "us" });
    expect(AlgoliaInsights._endpointOrigin).toBe(
      "https://insights.us.algolia.io"
    );
  });
  it("should set _endpointOrigin on instance to https://insights.de.algolia.io if region === 'de'", () => {
    AlgoliaInsights.init({ apiKey: "***", applicationID: "XXX", region: "de" });
    expect(AlgoliaInsights._endpointOrigin).toBe(
      "https://insights.de.algolia.io"
    );
  });
});

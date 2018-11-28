import AlgoliaInsights from "../insights";

const credentials = {
  apiKey: "test",
  applicationID: "test"
};

describe("Click method", () => {
  test("Should throw if init was not called", () => {
    expect(() => {
      AlgoliaInsights.click();
    }).toThrowError(
      "Before calling any methods on the analytics, you first need to call the 'init' function with applicationID and apiKey parameters"
    );
  });

  test("Should throw if objectID and position are not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.click();
    }).toThrowError(
      "No params were sent to click function, please provide an objectID and position to be reported"
    );
  });

  test("Should throw if objectID is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.click({ objectID: 1 });
    }).toThrowError(
      "required position parameter was not sent, click event position can not be properly sent without"
    );
  });

  test("Should throw if position is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.click({ position: 1 });
    }).toThrowError(
      "required objectID parameter was not sent, click event can not be properly attributed"
    );
  });

  test("Should throw if position is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.click({ position: 1 });
    }).toThrowError(
      "required objectID parameter was not sent, click event can not be properly attributed"
    );
  });

  test("Should call sendEvent with proper params", () => {
    const clickParams = { position: 1, objectID: "2", queryID: "testing" };

    AlgoliaInsights.init(credentials);
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.click(clickParams);

    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams
    );
  });
});

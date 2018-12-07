import AlgoliaInsights from "../insights";

const credentials = {
  apiKey: "test",
  applicationID: "test"
};

describe("Click method", () => {
  test("Should throw if queryID, objectIDs or positions are not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.click();
    }).toThrowError(
      "No params were sent to click function, please provide `queryID`,  `objectIDs` and `positions` to be reported"
    );
  });

  test("Should throw if objectIDs is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.click({ queryID: "testing", positions: [1] });
    }).toThrowError(
      "required objectIDs parameter was not sent, click event can not be properly sent without"
    );
  });

  test("Should throw if positions is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.click({ queryID: "testing", objectIDs: [1] });
    }).toThrowError(
      "required positions parameter was not sent, click event can not be properly sent without"
    );
  });

  test("Should throw if queryID is not sent", () => {
    AlgoliaInsights.init(credentials);
    expect(() => {
      AlgoliaInsights.click({ objectIDs: ["1"], positions: [1] });
    }).toThrowError(
      "required queryID parameter was not sent, click event can not be properly sent without"
    );
  });

  test("Should call sendEvent with proper params", () => {
    const clickParams = {
      positions: [1],
      objectIDs: ["2"],
      queryID: "testing"
    };

    AlgoliaInsights.init(credentials);
    (AlgoliaInsights as any).sendEvent = jest.fn();
    AlgoliaInsights.click(clickParams);

    expect((AlgoliaInsights as any).sendEvent).toHaveBeenCalledWith(
      "click",
      clickParams
    );
  });
});

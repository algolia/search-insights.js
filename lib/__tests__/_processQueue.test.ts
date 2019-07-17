import { processQueue } from "../_processQueue";

const makeGlobalObject = () => {
  // this is a simplified typescript tolerable version of the code we ask our
  // customers to embed when installing the insights client in the browser.
  // cf. https://github.com/algolia/search-insights.js#loading-and-initializing-the-library
  const globalObject: any = {};
  globalObject.AlgoliaAnalyticsObject = "aa";
  globalObject.aa = function() {
    globalObject.aa.queue = globalObject.aa.queue || [];
    globalObject.aa.queue.push(arguments);
  };
  return globalObject;
};

class FakeAlgoliaAnalytics {
  public init: Function;
  public otherMethod: Function;
  public processQueue: Function;
  constructor() {
    this.init = jest.fn();
    this.otherMethod = jest.fn(() => "otherMethodReturnedValue");

    this.processQueue = processQueue.bind(this); // the function we'll be testing
  }
}

describe("processQueue", () => {
  let insights;
  let globalObject;

  beforeEach(() => {
    globalObject = makeGlobalObject();
    insights = new FakeAlgoliaAnalytics();
  });

  it("should forward method calls that happen before the queue is processed", () => {
    const callback = jest.fn();
    globalObject.aa("init", { appID: "xxx", apiKey: "yyy" });
    globalObject.aa("otherMethod", { objectIDs: ["1"] }, callback);

    expect(insights.init).not.toHaveBeenCalled();
    expect(insights.otherMethod).not.toHaveBeenCalled();

    insights.processQueue(globalObject);

    expect(insights.init).toHaveBeenCalledWith({ appID: "xxx", apiKey: "yyy" });
    expect(insights.otherMethod).toHaveBeenCalledWith(
      { objectIDs: ["1"] },
      callback
    );
  });

  it("should forward method calls that happen after the queue is processed", () => {
    const callback = jest.fn();
    insights.processQueue(globalObject);

    expect(insights.init).not.toHaveBeenCalled();
    expect(insights.otherMethod).not.toHaveBeenCalled();

    globalObject.aa("init", { appID: "xxx", apiKey: "yyy" });
    globalObject.aa("otherMethod", { objectIDs: ["1"] }, callback);

    expect(insights.init).toHaveBeenCalledWith({ appID: "xxx", apiKey: "yyy" });
    expect(insights.otherMethod).toHaveBeenCalledWith(
      { objectIDs: ["1"] },
      callback
    );
  });

  it("should use the same `aa` function after library loaded", () => {
    const oldPointerFunction = globalObject.aa;
    insights.processQueue(globalObject);
    const newPointerFunction = globalObject.aa;
    expect(oldPointerFunction).toStrictEqual(newPointerFunction);
  });
});

import { processQueue } from '../_processQueue';

function makeGlobalObject(): any {
  // this is a simplified typescript tolerable version of the code we ask our
  // customers to embed when installing the insights client in the browser.
  // cf. https://github.com/algolia/search-insights.js#loading-and-initializing-the-library
  const globalObject: any = {};
  globalObject.AlgoliaAnalyticsObject = 'aa';
  globalObject.aa = function (): void {
    globalObject.aa.queue = globalObject.aa.queue || [];
    globalObject.aa.queue.push(arguments); // eslint-disable-line prefer-rest-params
  };
  return globalObject;
}

class FakeAlgoliaAnalytics {
  init: jest.Mock<any, any>;
  otherMethod: jest.Mock<any, any>;
  processQueue: jest.Mock<any, any>;
  constructor() {
    this.init = jest.fn();
    this.otherMethod = jest.fn(() => 'otherMethodReturnedValue');

    // @ts-expect-error
    this.processQueue = processQueue.bind(this); // the function we'll be testing
  }
}

describe('processQueue', () => {
  let insights: FakeAlgoliaAnalytics;
  let globalObject: any;

  beforeEach(() => {
    globalObject = makeGlobalObject();
    insights = new FakeAlgoliaAnalytics();
  });

  it('should forward method calls that happen before the queue is processed', () => {
    const callback = jest.fn();
    globalObject.aa('init', { appID: 'xxx', apiKey: 'yyy' });
    globalObject.aa('otherMethod', { objectIDs: ['1'] }, callback);

    expect(insights.init).not.toHaveBeenCalled();
    expect(insights.otherMethod).not.toHaveBeenCalled();

    insights.processQueue(globalObject);

    expect(insights.init).toHaveBeenCalledWith({ appID: 'xxx', apiKey: 'yyy' });
    expect(insights.otherMethod).toHaveBeenCalledWith(
      { objectIDs: ['1'] },
      callback
    );
  });

  it('should forward method calls that happen after the queue is processed', () => {
    const callback = jest.fn();
    insights.processQueue(globalObject);

    expect(insights.init).not.toHaveBeenCalled();
    expect(insights.otherMethod).not.toHaveBeenCalled();

    globalObject.aa('init', { appID: 'xxx', apiKey: 'yyy' });
    globalObject.aa('otherMethod', { objectIDs: ['1'] }, callback);

    expect(insights.init).toHaveBeenCalledWith({ appID: 'xxx', apiKey: 'yyy' });
    expect(insights.otherMethod).toHaveBeenCalledWith(
      { objectIDs: ['1'] },
      callback
    );
  });

  it('should use the same `aa` function after library loaded', () => {
    const oldPointerFunction = globalObject.aa;
    insights.processQueue(globalObject);
    const newPointerFunction = globalObject.aa;
    expect(oldPointerFunction).toBe(newPointerFunction);
  });
});

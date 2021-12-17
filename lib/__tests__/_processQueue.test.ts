import { jest } from '@jest/globals';

import { processQueue } from '../_processQueue';

interface AaFunctionForm extends Function {
  queue?: any[];
}

type GlobalObject = {
  AlgoliaAnalyticsObject: string;
  aa: AaFunctionForm;
};

const makeGlobalObject = (): GlobalObject => {
  // this is a simplified typescript tolerable version of the code we ask our
  // customers to embed when installing the insights client in the browser.
  // cf. https://github.com/algolia/search-insights.js#loading-and-initializing-the-library
  const globalObject: GlobalObject = {
    AlgoliaAnalyticsObject: 'aa',
    aa() {
      globalObject.aa.queue = globalObject.aa.queue || [];
      // eslint-disable-next-line prefer-rest-params
      globalObject.aa.queue.push(arguments);
    },
  };
  return globalObject;
};

/* eslint-disable @typescript-eslint/ban-types */
class FakeAlgoliaAnalytics {
  init: Function;
  otherMethod: Function;
  processQueue: Function;
  constructor() {
    jest.spyOn(this, 'init').mockImplementation();
    jest
      .spyOn(this, 'otherMethod')
      .mockImplementation(() => 'otherMethodReturnedValue');

    // @ts-expect-error
    this.processQueue = processQueue.bind(this); // the function we'll be testing
  }
}
/* eslint-enable @typescript-eslint/ban-types */

describe('processQueue', () => {
  let insights: FakeAlgoliaAnalytics;
  let globalObject: GlobalObject;

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

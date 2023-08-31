/* eslint-disable no-console */

import { getFunctionalInterface } from '../_getFunctionalInterface';
import AlgoliaAnalytics from '../insights';
import type { InsightsClient } from '../types';

describe('_getFunctionalInterface', () => {
  let aa: InsightsClient;

  beforeEach(() => {
    const analyticsInstance = new AlgoliaAnalytics({
      requestFn: jest.fn().mockResolvedValue(true),
    });
    aa = getFunctionalInterface(analyticsInstance);
  });

  it('warn about unknown function name', () => {
    console.warn = jest.fn();
    // @ts-expect-error
    aa('unknown-function');
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "The method `unknown-function` doesn't exist."
    );
  });
});

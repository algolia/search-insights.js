import { describe, it, beforeEach, expect, vi } from 'vitest';

import { getFunctionalInterface } from '../_getFunctionalInterface';
import AlgoliaAnalytics from '../insights';

describe('_getFunctionalInterface', () => {
  let aa: ReturnType<typeof getFunctionalInterface>;

  beforeEach(() => {
    const analyticsInstance = new AlgoliaAnalytics({ requestFn: () => {} });
    aa = getFunctionalInterface(analyticsInstance);
  });

  /* eslint-disable no-console */
  it('warn about unknown function name', () => {
    console.warn = vi.fn();
    // @ts-expect-error
    aa('unknown-function');
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "The method `unknown-function` doesn't exist."
    );
  });
  /* eslint-enable no-console */
});

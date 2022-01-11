import { describe, it, expect } from 'vitest';

import { createUUID } from '../uuid';

describe('createUUID', () => {
  it('should return a string composed of valid hex characters or dashes `-`', () => {
    // eslint-disable-next-line no-useless-escape
    expect(createUUID()).toMatch(/^[0-9a-f\-]+$/);
  });
});

import { createUUID } from './uuid';

describe('createUUID', () => {
  it('should return a string composed of valid hex characters or dashes `-`', () => {
    expect(createUUID()).toMatch(/^[0-9a-f\-]+$/);
  });
});

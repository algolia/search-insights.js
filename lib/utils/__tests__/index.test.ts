import { describe, it, expect } from 'vitest';

import { isFunction, isNumber, isString, isUndefined } from '../index';

describe('isUndefined', () => {
  const list = [
    [42, false],
    ['a string', false],
    [undefined, true],
    [() => null, false],
  ];

  list.forEach(([input, expected]) => {
    it(`should return ${expected} when passed ${input}`, () => {
      expect(isUndefined(input)).toEqual(expected);
    });
  });
});

describe('isNumber', () => {
  const list = [
    [42, true],
    ['a string', false],
    [undefined, false],
    [() => null, false],
  ];

  list.forEach(([input, expected]) => {
    it(`should return ${expected} when passed ${input}`, () => {
      expect(isNumber(input)).toEqual(expected);
    });
  });
});

describe('isString', () => {
  const list = [
    [42, false],
    ['a string', true],
    [undefined, false],
    [() => null, false],
  ];

  list.forEach(([input, expected]) => {
    it(`should return ${expected} when passed ${input}`, () => {
      expect(isString(input)).toEqual(expected);
    });
  });
});

describe('isFunction', () => {
  const list = [
    [42, false],
    ['a string', false],
    [undefined, false],
    [() => null, true],
  ];

  list.forEach(([input, expected]) => {
    it(`should return ${expected} when passed ${input}`, () => {
      expect(isFunction(input)).toEqual(expected);
    });
  });
});

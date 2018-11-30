import { isFunction, isNumber, isString, isUndefined } from "./index";

describe("isUndefined", () => {
  const tests = [
    { input: 42, expected: false },
    { input: "a string", expected: false },
    { input: undefined, expected: true },
    { input: () => null, expected: false }
  ];
  for (const { input, expected } of tests) {
    it(`should return ${expected} when passed ${input}`, () => {
      expect(isUndefined(input)).toEqual(expected);
    });
  }
});

describe("isNumber", () => {
  const tests = [
    { input: 42, expected: true },
    { input: "a string", expected: false },
    { input: undefined, expected: false },
    { input: () => null, expected: false }
  ];
  for (const { input, expected } of tests) {
    it(`should return ${expected} when passed ${input}`, () => {
      expect(isNumber(input)).toEqual(expected);
    });
  }
});

describe("isString", () => {
  const tests = [
    { input: 42, expected: false },
    { input: "a string", expected: true },
    { input: undefined, expected: false },
    { input: () => null, expected: false }
  ];
  for (const { input, expected } of tests) {
    it(`should return ${expected} when passed ${input}`, () => {
      expect(isString(input)).toEqual(expected);
    });
  }
});

describe("isFunction", () => {
  const tests = [
    { input: 42, expected: false },
    { input: "a string", expected: false },
    { input: undefined, expected: false },
    { input: () => null, expected: true }
  ];
  for (const { input, expected } of tests) {
    it(`should return ${expected} when passed ${input}`, () => {
      expect(isFunction(input)).toEqual(expected);
    });
  }
});

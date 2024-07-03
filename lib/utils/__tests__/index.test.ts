import {
  isFunction,
  isNumber,
  isPromise,
  isString,
  isUndefined
} from "../index";

describe("isUndefined", () => {
  test.each`
    input                | expected
    ${42}                | ${false}
    ${"a string"}        | ${false}
    ${undefined}         | ${true}
    ${() => null}        | ${false}
    ${Promise.resolve()} | ${false}
  `("should return $expected when passed $input", ({ input, expected }) => {
    expect(isUndefined(input)).toEqual(expected);
  });
});

describe("isNumber", () => {
  test.each`
    input                | expected
    ${42}                | ${true}
    ${"a string"}        | ${false}
    ${undefined}         | ${false}
    ${() => null}        | ${false}
    ${Promise.resolve()} | ${false}
  `("should return $expected when passed $input", ({ input, expected }) => {
    expect(isNumber(input)).toEqual(expected);
  });
});

describe("isString", () => {
  test.each`
    input                | expected
    ${42}                | ${false}
    ${"a string"}        | ${true}
    ${undefined}         | ${false}
    ${() => null}        | ${false}
    ${Promise.resolve()} | ${false}
  `("should return $expected when passed $input", ({ input, expected }) => {
    expect(isString(input)).toEqual(expected);
  });
});

describe("isFunction", () => {
  test.each`
    input                | expected
    ${42}                | ${false}
    ${"a string"}        | ${false}
    ${undefined}         | ${false}
    ${() => null}        | ${true}
    ${Promise.resolve()} | ${false}
  `("should return $expected when passed $input", ({ input, expected }) => {
    expect(isFunction(input)).toEqual(expected);
  });
});

describe("isPromise", () => {
  test.each`
    input                | expected
    ${42}                | ${false}
    ${"a string"}        | ${false}
    ${undefined}         | ${false}
    ${() => null}        | ${false}
    ${Promise.resolve()} | ${true}
  `("should return $expected when passed $input", ({ input, expected }) => {
    expect(isPromise(input)).toEqual(expected);
  });
});

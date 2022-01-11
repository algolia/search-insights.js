export const isUndefined = (value: any): value is undefined =>
  typeof value === 'undefined';

export const isString = (value: any): value is string =>
  typeof value === 'string';

export const isNumber = (value: any): value is number =>
  typeof value === 'number';

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: any): value is Function =>
  typeof value === 'function';

/* tslint:disable */

/**
 * ES5 Object.assign polyfill
 * src:
 *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign.
 */

export default function objectAssignPolyfill(): void {
  if (typeof Object.assign !== 'function') {
    Object.assign = function <T extends Record<string, unknown>, U>(
      target: T,
      _: U
    ): T & U {
      // .length of function is 2

      /* eslint-disable eqeqeq, no-eq-null */
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }
      /* eslint-enable */

      const to = Object(target);

      /* eslint-disable prefer-rest-params */
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index];
        /* eslint-enable */

        /* eslint-disable eqeqeq, no-eq-null */
        if (nextSource != null) {
          /* eslint-enable */

          // Skip over if undefined or null
          for (const nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }
}

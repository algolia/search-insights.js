/* tslint:disable */

export default function objectKeysPolyfill(): void {
  if (!Object.keys) {
    Object.keys = (function (): (obj: any) => any[] {
      const hasOwnProperty = Object.prototype.hasOwnProperty;
      const hasDontEnumBug = !{ toString: null }.propertyIsEnumerable(
        "toString"
      );
      const dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor",
      ];
      const dontEnumsLength = dontEnums.length;

      return function (obj: any): any[] {
        if (
          typeof obj !== "function" &&
          (typeof obj !== "object" || obj === null)
        ) {
          throw new TypeError("Object.keys called on non-object");
        }

        const result = [];
        let prop;
        let i;

        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    })();
  }
}

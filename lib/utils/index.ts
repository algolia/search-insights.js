// use theses type checking helpers to avoid mistyping "undefind", I mean "undfined"
export const isUndefined = (value) => typeof value === "undefined";
export const isString = (value) => typeof value === "string";
export const isNumber = (value) => typeof value === "number";
export const isFunction = (value) => typeof value === "function";
export * from "./extractAdditionalParams";
export * from "./featureDetection";

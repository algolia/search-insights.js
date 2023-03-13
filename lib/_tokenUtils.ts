import { createUUID } from "./utils/uuid";
import { isFunction, supportsCookies } from "./utils";

const COOKIE_KEY = "_ALGOLIA";
export const MONTH = 30 * 24 * 60 * 60 * 1000;

const setCookie = (name: string, value: number | string, duration: number) => {
  const d = new Date();
  d.setTime(d.getTime() + duration);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

export const getCookie = (name: string): string => {
  const prefix = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(prefix) === 0) {
      return c.substring(prefix.length, c.length);
    }
  }
  return "";
};

export function setAnonymousUserToken(): void {
  if (!supportsCookies()) {
    return;
  }
  const foundToken = getCookie(COOKIE_KEY);
  if (
    !foundToken ||
    foundToken === "" ||
    foundToken.indexOf("anonymous-") !== 0
  ) {
    this.setUserToken(`anonymous-${createUUID()}`);
    setCookie(COOKIE_KEY, this._userToken, this._cookieDuration);
  } else {
    this.setUserToken(foundToken);
  }
}

export function setUserToken(userToken: string | number): void {
  this._userToken = userToken;
  if (isFunction(this._onUserTokenChangeCallback)) {
    this._onUserTokenChangeCallback(this._userToken);
  }
}

export function getUserToken(
  options?: any,
  callback?: (err: any, userToken: string) => void
): string {
  if (isFunction(callback)) {
    callback(null, this._userToken);
  }
  return this._userToken;
}

export function onUserTokenChange(
  callback?: (userToken: string) => void,
  options?: { immediate: boolean }
): void {
  this._onUserTokenChangeCallback = callback;
  if (
    options &&
    options.immediate &&
    isFunction(this._onUserTokenChangeCallback)
  ) {
    this._onUserTokenChangeCallback(this._userToken);
  }
}

import { createUUID } from "./utils/uuid";
import { isFunction, supportsCookies } from "./utils";

const COOKIE_KEY = "_ALGOLIA";

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

export const ANONYMOUS_USER_TOKEN = "ANONYMOUS_USER_TOKEN";

export function setUserToken(userToken: string | number): void {
  if (userToken === ANONYMOUS_USER_TOKEN) {
    if (!supportsCookies()) {
      throw new Error(
        "Tracking of anonymous users is only possible on environments which support cookies."
      );
    }
    const foundToken = getCookie(COOKIE_KEY);
    if (
      !foundToken ||
      foundToken === "" ||
      foundToken.indexOf("anonymous-") !== 0
    ) {
      this._userToken = `anonymous-${createUUID()}`;
      setCookie(COOKIE_KEY, this._userToken, this._cookieDuration);
    } else {
      this._userToken = foundToken;
    }
  } else {
    this._userToken = userToken;
  }
  if (this._onUserTokenChangeCallback) {
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
  callback: (userToken: string) => void,
  options?: { immediate: boolean }
): void {
  this._onUserTokenChangeCallback = callback;
  if (options && options.immediate) {
    this._onUserTokenChangeCallback(this._userToken);
  }
}

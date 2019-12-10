import { createUUID } from "./utils/uuid";
import { isFunction, supportsCookies } from "./utils";

const USER_TOKEN_COOKIE_KEY = "alg_user_token";
const ANONYMOUS_TOKEN_COOKIE_KEY = "_ALGOLIA";
// TODO: rename this to alg_anonymous_token in a future release
// Add code in init checking if _ALOGLIA cookie exists and replaces it in alg_anonymous_token

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

export function reuseUserTokenStoredInCookies() {
  if (!supportsCookies()) {
    throw new Error("This environment does not support cookies.");
  }

  const userToken = getCookie(USER_TOKEN_COOKIE_KEY);
  if (userToken) {
    this._userToken = userToken;
    return;
  }

  const anonymousToken = getCookie(ANONYMOUS_TOKEN_COOKIE_KEY);
  if (anonymousToken) {
    this._userToken = anonymousToken;
    return;
  }

  throw new Error("No cookies found.");
}

export function setUserToken(userToken: string | number): void {
  if (userToken === ANONYMOUS_USER_TOKEN) {
    if (!supportsCookies()) {
      throw new Error(
        "Tracking of anonymous users is only possible on environments which support cookies."
      );
    }
    const currentAnonymousToken = getCookie(ANONYMOUS_TOKEN_COOKIE_KEY);
    if (
      !currentAnonymousToken ||
      currentAnonymousToken === "" ||
      currentAnonymousToken.indexOf("anonymous-") !== 0
    ) {
      // create anonymous token
      const newAnonymousToken = `anonymous-${createUUID()}`;
      setCookie(
        ANONYMOUS_TOKEN_COOKIE_KEY,
        newAnonymousToken,
        this._cookieDuration
      );
      this._userToken = newAnonymousToken;
    } else {
      // reuse found anonymous token
      this._userToken = currentAnonymousToken;
    }
  } else {
    if (supportsCookies()) {
      const currentUserToken = getCookie(USER_TOKEN_COOKIE_KEY);
      if (currentUserToken !== userToken) {
        // only recreate the cookie if it's new userToken
        setCookie(USER_TOKEN_COOKIE_KEY, userToken, this._cookieDuration);
      }
    }
    this._userToken = userToken;
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

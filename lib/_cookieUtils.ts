import { createUUID } from "./utils/uuid";
// Cookie key
const COOKIE_KEY = "_ALGOLIA";

/**
 * Set Cookie
 * @param {[type]} cname  [description]
 * @param {[type]} cvalue [description]
 * @param {[type]} exdays [description]
 */
const setCookie = (
  cname: string,
  cvalue: number | string,
  cookieDuration: number
) => {
  const d = new Date();
  d.setTime(d.getTime() + cookieDuration);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
};

/**
 * getCookie
 * @param  {[type]} cname [description]
 * @return {[type]}       [description]
 */
const getCookie = (cname: string): string => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const ANONYMOUS_USER_TOKEN = "ANONYMOUS_USER_TOKEN";

export function setUserToken(userToken: string | number): void {
  if (userToken === ANONYMOUS_USER_TOKEN) {
    const foundToken = getCookie(COOKIE_KEY);
    if (
      !foundToken ||
      foundToken === "" ||
      !foundToken.startsWith("anonymous-")
    ) {
      this._userToken = `anonymous-${createUUID()}`;
      setCookie(COOKIE_KEY, this._userToken, this._cookieDuration);
    } else {
      this._userToken = foundToken;
    }
  } else {
    this._userToken = userToken;
  }
}

export function getUserToken() {
  return this._userToken;
}

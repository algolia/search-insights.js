import type AlgoliaAnalytics from './insights';
import { supportsCookies } from './utils/featureDetection';
import { isFunction } from './utils/typeCheckers';
import { createUUID } from './utils/uuid';

const COOKIE_KEY = '_ALGOLIA';

const setCookie = (name: string, value: string, duration: number) => {
  const d = new Date();
  d.setTime(d.getTime() + duration);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

export const getCookie = (name: string): string => {
  const prefix = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(prefix) === 0) {
      return c.substring(prefix.length, c.length);
    }
  }
  return '';
};

export function setAnonymousUserToken(this: AlgoliaAnalytics): void {
  if (!supportsCookies()) {
    return;
  }
  const foundToken = getCookie(COOKIE_KEY);
  const isTokenFromCookieValid =
    foundToken && foundToken !== '' && foundToken.indexOf('anonymous-') === 0;

  if (isTokenFromCookieValid) {
    this.setUserToken(foundToken);
  } else {
    this.setUserToken(`anonymous-${createUUID()}`);
    // _userToken is just assigned, so it exists.
    // _cookieDuration is asssigned at init(), and this happens after that. So it exists.
    setCookie(COOKIE_KEY, this._userToken!, this._cookieDuration!);
  }
}

export function setUserToken(this: AlgoliaAnalytics, userToken: string): void {
  this._userToken = userToken;
  if (isFunction(this._onUserTokenChangeCallback)) {
    this._onUserTokenChangeCallback(this._userToken);
  }
}

export function getUserToken(
  this: AlgoliaAnalytics,
  _options?: any,
  callback?: (err: any, userToken?: string) => void
): string | undefined {
  if (isFunction(callback)) {
    callback(null, this._userToken);
  }
  return this._userToken;
}

export function onUserTokenChange(
  this: AlgoliaAnalytics,
  callback?: (userToken: string | undefined) => void,
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

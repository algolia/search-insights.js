// Cookie key
const COOKIE_KEY = "_ALGOLIA";

/**
 * Set Cookie
 * @param {[type]} cname  [description]
 * @param {[type]} cvalue [description]
 * @param {[type]} exdays [description]
 */
const setCookie = (cname: string, cvalue: string, cookieDuration: number) => {
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

/**
 * Return new UUID
 * @return {[string]} new UUID
 */
const checkUserIdCookie = (
  userSpecifiedID?: string | number,
  cookieDuration?: number
): string => {
  const userToken = getCookie(COOKIE_KEY);

  if (!userToken || userToken === "") {
    const newUUID = createUUID();
    setCookie(COOKIE_KEY, newUUID, cookieDuration);
    return newUUID;
  }
  setCookie(COOKIE_KEY, userToken, cookieDuration);
  return userToken;
};

/**
 * Create UUID according to
 * https://www.ietf.org/rfc/rfc4122.txt
 * @return {[string]} generated UUID
 */
const createUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const userToken = checkUserIdCookie;

export { userToken };

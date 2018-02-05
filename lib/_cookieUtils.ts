
// Cookie key
const COOKIE_KEY = '_ALGOLIA';

/**
 * Set Cookie
 * @param {[type]} cname  [description]
 * @param {[type]} cvalue [description]
 * @param {[type]} exdays [description]
 */
const setCookie = (cname: string, cvalue: string, exdays: number) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * getCookie
 * @param  {[type]} cname [description]
 * @return {[type]}       [description]
 */
const getCookie = (cname: string):string => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Return new UUID 
 * @return {[string]} new UUID
 */
const checkUserIdCookie = (userSpecifiedID?: string|number):string => {
  const userID = getCookie(COOKIE_KEY)

  if(!userID || userID === ""){
    const newUUID = createUUID()
    setCookie(COOKIE_KEY, newUUID, 10)
    return newUUID;
  } else {
    setCookie(COOKIE_KEY, userID, 10)
    return userID;
  }
};

/**
 * Create UUID according to
 * https://www.ietf.org/rfc/rfc4122.txt
 * @return {[string]} generated UUID
 */
const createUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const sessionID = createUUID;
const userID = checkUserIdCookie;

export { sessionID, userID }

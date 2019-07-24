import { request as nodeHttpRequest } from "http";

export const supportsCookies = () => {
  try {
    return Boolean(navigator.cookieEnabled);
  } catch (e) {
    return false;
  }
};

export const supportsSendBeacon = () => {
  try {
    return Boolean(navigator.sendBeacon);
  } catch (e) {
    return false;
  }
};

export const supportsXMLHttpRequest = () => {
  try {
    return Boolean(XMLHttpRequest);
  } catch (e) {
    return false;
  }
};

export const supportsNodeHttpModule = () => {
  try {
    return Boolean(nodeHttpRequest);
  } catch (e) {
    return false;
  }
};

import {
  supportsSendBeacon,
  supportsXMLHttpRequest,
  supportsNodeHttpModule
} from "./featureDetection";

export type RequestFnType = (url: string, data: object) => void;

const errorMessage =
  "Could not find a supported HTTP request client in this environment.";

export function getRequesterForBrowser() {
  if (supportsSendBeacon()) {
    return requestWithSendBeacon;
  }

  if (supportsXMLHttpRequest()) {
    return requestWithXMLHttpRequest;
  }

  throw new Error(errorMessage);
}

export function getRequesterForNode() {
  if (supportsNodeHttpModule()) {
    return requestWithNodeHttpModule;
  }

  throw new Error(errorMessage);
}

export function getRequester() {
  if (supportsSendBeacon()) {
    return requestWithSendBeacon;
  }

  if (supportsXMLHttpRequest()) {
    return requestWithXMLHttpRequest;
  }

  if (supportsNodeHttpModule()) {
    return requestWithNodeHttpModule;
  }

  throw new Error(errorMessage);
}

const requestWithSendBeacon: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  navigator.sendBeacon(url, serializedData);
};

const requestWithXMLHttpRequest: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  const report = new XMLHttpRequest();
  report.open("POST", url);
  report.send(serializedData);
};

const requestWithNodeHttpModule: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": serializedData.length
    }
  };

  const { request: nodeRequest } =
    url.indexOf("https://") === 0 ? require("https") : require("http");
  const req = nodeRequest(url, options);

  req.on("error", error => {
    console.error(error);
  });

  req.write(serializedData);
  req.end();
};

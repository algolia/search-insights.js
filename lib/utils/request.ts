import { request as nodeHttpRequest } from "http";
import { request as nodeHttpsRequest } from "https";
import {
  supportsSendBeacon,
  supportsXMLHttpRequest,
  supportsNodeHttpModule
} from "./featureDetection";

type RequestType = (url: string, data: object) => void;

const request: RequestType = (url, data) => {
  const fn = makeRequester();
  fn(url, data);
};

function makeRequester() {
  if (supportsSendBeacon()) {
    return requestWithSendBeacon;
  }

  if (supportsXMLHttpRequest()) {
    return requestWithXMLHttpRequest;
  }

  if (supportsNodeHttpModule()) {
    return requestWithNodeHttpModule;
  }

  throw new Error(
    "Could not find a supported HTTP request client in this environment."
  );
}

const requestWithSendBeacon: RequestType = (url, data) => {
  const serializedData = JSON.stringify(data);
  navigator.sendBeacon(url, serializedData);
};

const requestWithXMLHttpRequest: RequestType = (url, data) => {
  const serializedData = JSON.stringify(data);
  const report = new XMLHttpRequest();
  report.open("POST", url);
  report.send(serializedData);
};

const requestWithNodeHttpModule: RequestType = (url, data) => {
  const serializedData = JSON.stringify(data);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": serializedData.length
    }
  };

  const nodeRequest =
    url.indexOf("https://") === 0 ? nodeHttpsRequest : nodeHttpRequest;
  const req = nodeRequest(url, options);

  req.on("error", error => {
    console.error(error);
  });

  req.write(serializedData);
  req.end();
};

export default request;

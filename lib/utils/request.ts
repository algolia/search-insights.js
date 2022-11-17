export type RequestFnType = (
  url: string,
  data: object,
  options?: {
    errorCallback: (
      event: ProgressEvent<XMLHttpRequestEventTarget> | Error
    ) => void;
  }
) => void;

export const requestWithSendBeacon: RequestFnType = (url, data, options?) => {
  const serializedData = JSON.stringify(data);
  if (!navigator.sendBeacon(url, serializedData)) {
    return requestWithXMLHttpRequest(url, data, options);
  }
};

export const requestWithXMLHttpRequest: RequestFnType = (
  url,
  data,
  options?
) => {
  const serializedData = JSON.stringify(data);
  const report = new XMLHttpRequest();
  if (options && options.errorCallback) {
    report.addEventListener("error", options.errorCallback);
  }
  report.open("POST", url);
  report.setRequestHeader("Content-Type", "application/json");
  report.setRequestHeader("Content-Length", `${serializedData.length}`);
  report.send(serializedData);
};

export const requestWithNodeHttpModule: RequestFnType = (
  url,
  data,
  options?
) => {
  const serializedData = JSON.stringify(data);
  const { protocol, host, path } = require("url").parse(url);
  const reqOpts = {
    protocol,
    host,
    path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": serializedData.length
    }
  };

  const { request: nodeRequest } =
    url.indexOf("https://") === 0 ? require("https") : require("http");
  const req = nodeRequest(reqOpts);

  req.on("error", error => {
    console.error(error);
    if (options && options.errorCallback) {
      options.errorCallback(error);
    }
  });

  req.write(serializedData);
  req.end();
};

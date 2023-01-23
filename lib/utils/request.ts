export type RequestFnType = (url: string, data: object) => void;

export const requestWithSendBeacon: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  if (!navigator.sendBeacon(url, serializedData)) {
    return requestWithXMLHttpRequest(url, data);
  }
};

export const requestWithXMLHttpRequest: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  const report = new XMLHttpRequest();
  report.open("POST", url);
  report.setRequestHeader("Content-Type", "application/json");
  report.setRequestHeader("Content-Length", `${serializedData.length}`);
  report.send(serializedData);
};

export const requestWithNodeHttpModule: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  const { protocol, host, path } = require("url").parse(url);
  const options = {
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
  const req = nodeRequest(options);

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(serializedData);
  req.end();
};

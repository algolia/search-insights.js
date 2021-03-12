export type RequestCallback = (error?: any, data?: any) => void;
export type RequestFnType = (
  url: string,
  data: object,
  callback?: RequestCallback
) => void;

export const requestWithSendBeacon: RequestFnType = (url, data, callback) => {
  const serializedData = JSON.stringify(data);
  navigator.sendBeacon(url, serializedData);
  if (callback) {
    callback();
  }
};

export const requestWithXMLHttpRequest: RequestFnType = (
  url,
  data,
  callback
) => {
  const serializedData = JSON.stringify(data);
  const xhr = new XMLHttpRequest();
  if (callback) {
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const status = xhr.status;
        if (status >= 200 && status < 400) {
          callback(null, xhr.responseText);
        } else {
          callback({
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText
          });
        }
      }
    };
  }
  xhr.open("POST", url);
  xhr.send(serializedData);
};

export const requestWithNodeHttpModule: RequestFnType = (
  url,
  data,
  callback
) => {
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
  const req = nodeRequest(options, res => {
    let responseText = "";
    // We need to hook `data` event. If not, we won't get `end` event.
    // https://stackoverflow.com/questions/23817180/node-js-response-from-http-request-not-calling-end-event-without-including-da
    res.on("data", data => {
      responseText += data;
    });
    res.on("end", () => {
      if (!callback) {
        return;
      }
      const { statusCode, statusMessage } = res;
      if (statusCode >= 200 && statusCode < 400) {
        callback(null, responseText);
      } else {
        callback({
          responseText,
          status: statusCode,
          statusText: statusMessage
        });
      }
    });
  });
  req.on("error", error => {
    if (callback) {
      callback(error);
    }
  });
  req.write(serializedData);
  req.end();
};

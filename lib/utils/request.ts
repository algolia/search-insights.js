import { getNodeHttpModule } from './getNodeHttpModule';

export type RequestFnType = (
  url: string,
  data: Record<string, unknown>
) => void;

export const requestWithXMLHttpRequest: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  const report = new XMLHttpRequest();
  report.open('POST', url);
  report.send(serializedData);
};

/* eslint-disable consistent-return */
export const requestWithSendBeacon: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  if (!navigator.sendBeacon(url, serializedData)) {
    return requestWithXMLHttpRequest(url, data);
  }
};
/* eslint-enable consistent-return */

/* eslint-disable @typescript-eslint/no-var-requires */
export const requestWithNodeHttpModule: RequestFnType = (url, data) => {
  const serializedData = JSON.stringify(data);
  const { protocol, host, path } = require('url').parse(url);
  const options = {
    protocol,
    host,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': serializedData.length,
    },
  };

  const { request: nodeRequest } = getNodeHttpModule(url);
  const req = nodeRequest(options);

  req.on('error', (error: any) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  req.write(serializedData);
  req.end();
};
/* eslint-enable @typescript-eslint/no-var-requires */

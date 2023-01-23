import { request as nodeHttpRequest } from 'http';
import { request as nodeHttpsRequest } from 'https';

import {
  supportsSendBeacon,
  supportsXMLHttpRequest,
  supportsNodeHttpModule,
} from '../featureDetection';
import { getRequesterForBrowser } from '../getRequesterForBrowser';
import { getRequesterForNode } from '../getRequesterForNode';

jest.mock('../featureDetection');
jest.mock('http');
jest.mock('https');

describe('request', () => {
  const sendBeaconBackup = navigator.sendBeacon;
  const XMLHttpRequestBackup = window.XMLHttpRequest;

  const sendBeacon = jest.fn(() => true);
  const open = jest.fn();
  const send = jest.fn();
  const setRequestHeader = jest.fn();
  const write = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    navigator.sendBeacon = sendBeacon;
    (window as any).XMLHttpRequest = function () {
      this.open = open;
      this.send = send;
      this.setRequestHeader = setRequestHeader;
    };
    (nodeHttpRequest as jest.Mock).mockImplementation(() => {
      return {
        write,
        on: jest.fn(),
        end: jest.fn(),
      };
    });
    (nodeHttpsRequest as jest.Mock).mockImplementation(() => {
      return {
        write,
        on: jest.fn(),
        end: jest.fn(),
      };
    });
  });

  afterAll(() => {
    navigator.sendBeacon = sendBeaconBackup;
    window.XMLHttpRequest = XMLHttpRequestBackup;
  });

  it('should pick sendBeacon first if available', () => {
    (supportsSendBeacon as jest.Mock).mockImplementation(() => true);
    (supportsXMLHttpRequest as jest.Mock).mockImplementation(() => true);
    (supportsNodeHttpModule as jest.Mock).mockImplementation(() => true);
    const url = 'https://random.url';
    const data = { foo: 'bar' };
    const request = getRequesterForBrowser();
    request(url, data);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);
    expect(navigator.sendBeacon).toHaveBeenLastCalledWith(
      url,
      JSON.stringify(data)
    );
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
  });

  it('should send with XMLHttpRequest if sendBeacon is not available', () => {
    (supportsSendBeacon as jest.Mock).mockImplementation(() => false);
    (supportsXMLHttpRequest as jest.Mock).mockImplementation(() => true);
    (supportsNodeHttpModule as jest.Mock).mockImplementation(() => true);
    const url = 'https://random.url';
    const data = { foo: 'bar' };
    const request = getRequesterForBrowser();
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
    expect(setRequestHeader).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenLastCalledWith('POST', url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
  });

  it('should fall back to XMLHttpRequest if sendBeacon returns false', () => {
    navigator.sendBeacon = jest.fn(() => false);
    (supportsSendBeacon as jest.Mock).mockImplementation(() => true);
    (supportsXMLHttpRequest as jest.Mock).mockImplementation(() => true);
    (supportsNodeHttpModule as jest.Mock).mockImplementation(() => false);
    const url = 'https://random.url';
    const data = { foo: 'bar' };
    const request = getRequesterForBrowser();
    request(url, data);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);

    expect(open).toHaveBeenCalledTimes(1);
    expect(setRequestHeader).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenLastCalledWith('POST', url);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
  });

  it('should send with nodeHttpRequest if url does not start with https://', () => {
    (supportsSendBeacon as jest.Mock).mockImplementation(() => false);
    (supportsXMLHttpRequest as jest.Mock).mockImplementation(() => false);
    (supportsNodeHttpModule as jest.Mock).mockImplementation(() => true);
    const url = 'http://random.url';
    const data = { foo: 'bar' };
    const request = getRequesterForNode();
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).not.toHaveBeenCalled();
    expect(nodeHttpRequest).toHaveBeenLastCalledWith({
      protocol: 'http:',
      host: 'random.url',
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length,
      },
    });
    expect(nodeHttpRequest).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('should send with nodeHttpsRequest if url starts with https://', () => {
    (supportsSendBeacon as jest.Mock).mockImplementation(() => false);
    (supportsXMLHttpRequest as jest.Mock).mockImplementation(() => false);
    (supportsNodeHttpModule as jest.Mock).mockImplementation(() => true);
    const url = 'https://random.url';
    const data = { foo: 'bar' };
    const request = getRequesterForNode();
    request(url, data);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(setRequestHeader).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(nodeHttpRequest).not.toHaveBeenCalled();
    expect(nodeHttpsRequest).toHaveBeenLastCalledWith({
      protocol: 'https:',
      host: 'random.url',
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length,
      },
    });
    expect(nodeHttpsRequest).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenLastCalledWith(JSON.stringify(data));
    expect(write).toHaveBeenCalledTimes(1);
  });
});

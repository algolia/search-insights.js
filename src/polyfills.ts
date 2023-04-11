import fetch, { Headers, Request, Response } from 'node-fetch';

if (!globalThis.fetch) {
  (globalThis as any).fetch = fetch;
  (globalThis as any).Headers = Headers;
  (globalThis as any).Request = Request;
  (globalThis as any).Response = Response;
}

if (!globalThis.localStorage) {
  const store = {};
  (globalThis.localStorage as any) = {};
  globalThis.localStorage.getItem = (key) => store[key] ?? null;
  globalThis.localStorage.setItem = (key, value) => {
    store[key] = value;
  };
}

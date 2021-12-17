declare module '*/package.json';

declare const __DEV__: boolean;
declare const __FLAVOR__:
  | 'browser-cjs'
  | 'browser-iife'
  | 'browser-umd'
  | 'node-cjs';

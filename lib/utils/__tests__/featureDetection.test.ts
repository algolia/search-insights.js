import { jest } from '@jest/globals';

import {
  supportsCookies,
  supportsSendBeacon,
  supportsXMLHttpRequest,
} from '../featureDetection';

describe('featureDetection in jsdom env', () => {
  describe('supportsCookies', () => {
    it('returns true', () => {
      expect(supportsCookies()).toBe(true);
    });
  });

  describe('supportsSendBeacon', () => {
    it('should return false if not available', () => {
      // by default in jsdom env, navigator.sendBeacon is undefined
      expect(supportsSendBeacon()).toBe(false);
    });

    it('should return true if available', () => {
      jest.spyOn(navigator, 'sendBeacon').mockImplementation();
      expect(supportsSendBeacon()).toBe(true);
      // @ts-expect-error
      delete navigator.sendBeacon;
    });
  });

  describe('supportsXMLHttpRequest', () => {
    it('should return true if available', () => {
      // by default in jsdom env, XMLHttpRequest is available
      expect(supportsXMLHttpRequest()).toBe(true);
    });

    it('should return false if non available', () => {
      const XMLHttpRequest = (window as any).XMLHttpRequest;
      delete (window as any).XMLHttpRequest;
      expect(supportsXMLHttpRequest()).toBe(false);
      (window as any).XMLHttpRequest = XMLHttpRequest;
    });
  });
});

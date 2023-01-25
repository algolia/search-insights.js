import cookie from 'js-cookie';

import { tld } from './tld';

describe('tld', () => {
  beforeEach(() => {
    const cookies: { [key: string]: string } = {};

    jest.spyOn(cookie, 'set').mockImplementation((key, val, opts) => {
      const parts = opts?.domain?.split('.') ?? [];
      if (parts[1] === 'co') return;
      cookies[key] = val;
      return val;
    });

    jest.spyOn(cookie, 'get').mockImplementation(() => {
      return cookies;
    });
  });

  it('matches the urls', () => {
    expect(tld('http://www.google.com')).toEqual('google.com');
    expect(tld('http://gist.github.com/foo/bar')).toEqual('github.com');
    expect(tld('http://localhost:3000')).toEqual(undefined);
    expect(tld('https://google.com:443/stuff')).toEqual('google.com');
    expect(tld('http://dev:3000')).toEqual(undefined);
    expect(tld('http://app.search.io')).toEqual('search.io');
  });
});

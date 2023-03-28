import Cookies from 'js-cookie';

import { tld } from '../../tld';

import type { Store } from '.';

export class ExpiringCookieStore implements Store {
  constructor(private lease: number = 60) {}

  read(key: string) {
    const value = Cookies.get(key);
    if (value) {
      // If value is present, renew it's lease.
      return this.write(key, value);
    }

    return value;
  }

  write(key: string, value: string) {
    Cookies.set(key, value, {
      expires: this.getNewExpiry(),
      domain: tld(window.location.href),
      path: '/',
      sameSite: 'Lax',
      secure: undefined,
    });
    return value;
  }

  delete(key: string) {
    Cookies.remove(key);
  }

  private getNewExpiry() {
    return new Date(new Date().getTime() + this.lease * 60 * 1000);
  }
}

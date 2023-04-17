import { createUUID } from '../utils/uuid';

import type { Store } from './stores';
import { ExpiringCookieStore, InMemoryStore } from './stores';

export type UserTokenOptions = Partial<{
  anonymousUserToken: { enabled: boolean; lease: number };
  userToken: { cookie: boolean; lease: number };
}>;

export const DefaultUserTokenOptions = {
  anonymousUserToken: { enabled: false, lease: 60 },
  userToken: { cookie: true, lease: 1440 },
} satisfies UserTokenOptions;

/*

By default we want an anonymousUserToken with a configurable lease.
This id should be read each time we send an event, to renew its lease.

If a builder explicitly sets a userToken, we want to clear this anonymousUserToken and use the explicit one,
and if the configuration has cookie storage enabled, store the userToken in a cookie.

*/

export const USER_TOKEN_KEY = 'alg:userToken';
export const ANONYMOUS_ID_KEY = 'alg:anonymousId';

export class UserToken {
  private anonymousUserTokenStore?: ExpiringCookieStore;
  private userTokenStore: Store;
  private opts: UserTokenOptions;

  constructor(opts: UserTokenOptions = DefaultUserTokenOptions) {
    this.opts = opts;

    if (opts.anonymousUserToken?.enabled) {
      this.anonymousUserTokenStore = new ExpiringCookieStore(
        opts.anonymousUserToken.lease
      );
    }

    if (opts.userToken?.cookie) {
      this.userTokenStore = new ExpiringCookieStore(opts.userToken.lease);
    } else {
      this.userTokenStore = new InMemoryStore();
    }
  }

  setUserToken(userToken?: string) {
    if (!userToken) {
      this.userTokenStore.delete(USER_TOKEN_KEY);

      if (!this.anonymousUserTokenStore) {
        this.anonymousUserTokenStore = new ExpiringCookieStore(
          this.opts.anonymousUserToken?.lease
        );
      }
    } else {
      this.userTokenStore.write(USER_TOKEN_KEY, userToken);
      this.anonymousUserTokenStore?.delete(ANONYMOUS_ID_KEY);
    }
  }

  removeUserToken() {
    this.userTokenStore.delete(USER_TOKEN_KEY);
    this.anonymousUserTokenStore?.delete(ANONYMOUS_ID_KEY);
    if (!this.opts.anonymousUserToken?.enabled) {
      delete this.anonymousUserTokenStore;
    }
  }

  getUserToken() {
    const userToken = this.userTokenStore.read(USER_TOKEN_KEY);
    if (userToken) {
      return userToken;
    }

    return this.anonId();
  }

  private anonId() {
    if (!this.anonymousUserTokenStore) {
      return undefined;
    }

    const id = this.anonymousUserTokenStore?.read(ANONYMOUS_ID_KEY);
    if (id) {
      return id;
    }

    return this.anonymousUserTokenStore?.write(
      ANONYMOUS_ID_KEY,
      `anon-${createUUID()}`
    );
  }
}

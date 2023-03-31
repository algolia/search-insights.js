import { createUUID } from '../utils/uuid';

import type { Store } from './stores';
import { ExpiringCookieStore, InMemoryStore } from './stores';

export type UserTokenOptions = Partial<{
  anonymousId: { enabled: boolean; lease: number };
  userToken: { cookie: boolean; lease: number };
}>;

export const DefaultUserTokenOptions = {
  anonymousId: { enabled: false, lease: 60 },
  userToken: { cookie: true, lease: 1440 },
};

/*

By default we want an anonymousId with a configurabale lease.
This id should be read each time we send an event, to renew its lease.

If a builder explicitly sets a userToken, we want to clear this anonymousId and use the explicit one,
and if the configuration has cookie storage enabled, store the userToken in a cookie.

*/

export const USER_TOKEN_KEY = 'alg:userToken';
export const ANONYMOUS_ID_KEY = 'alg:anonymousId';

export class UserToken {
  private anonymousIdStore?: ExpiringCookieStore;
  private userTokenStore: Store;
  private opts: UserTokenOptions;

  constructor(opts: UserTokenOptions = DefaultUserTokenOptions) {
    this.opts = opts;

    if (opts.anonymousId?.enabled) {
      this.anonymousIdStore = new ExpiringCookieStore(opts.anonymousId.lease);
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

      if (!this.anonymousIdStore) {
        this.anonymousIdStore = new ExpiringCookieStore(
          this.opts.anonymousId?.lease
        );
      }
    } else {
      this.userTokenStore.write(USER_TOKEN_KEY, userToken);
      this.anonymousIdStore?.delete(ANONYMOUS_ID_KEY);
    }
  }

  removeUserToken() {
    this.userTokenStore.delete(USER_TOKEN_KEY);
    this.anonymousIdStore?.delete(ANONYMOUS_ID_KEY);
    if (!this.opts.anonymousId?.enabled) {
      delete this.anonymousIdStore;
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
    if (!this.anonymousIdStore) {
      return undefined;
    }

    const id = this.anonymousIdStore?.read(ANONYMOUS_ID_KEY);
    if (id) {
      return id;
    }

    return this.anonymousIdStore?.write(
      ANONYMOUS_ID_KEY,
      `anon-${createUUID()}`
    );
  }
}

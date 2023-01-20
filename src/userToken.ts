import Cookies from "js-cookie";
import { tld } from "./tld";

class ExpiringCookieStore {
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
            path: "/",
            sameSite: "Lax",
            secure: undefined,
        });
        return value;
    }

    delete(key: string) {
        Cookies.delete(key)
    }

    private getNewExpiry() {
        return new Date(new Date().getTime() + this.lease * 60 * 1000);
    }
}

class InMemoryStore {
    private cache: Record<string,string> = {};

    read(key: string) {
        return this.cache[key]
    }

    write(key: string, value: string) {
        this.cache[key] = value;
        return value;
    }
}

interface Store {
    read(key: string): string | undefined
    write(key: string, value: string): string
}

export type UserTokenOptions = Partial<{
    anonmyousId: { enabled: boolean; lease: number },
    userToken: { cookie: boolean, lease: number }
}>

const DefaultUserTokenOptions = {
    anonmyousId: {enabled: true, lease: 60},
    userToken: {cookie: true, lease: 1440}
}

/*

By default we want an anonmyousId with a configurabale lease.
This id should be read each time we send an event, to renew its lease.

If a builder explicitly sets a userToken, we want to clear this anonmyousId and use the explicit one,
and if the configuration has cookie storage enabled, store the userToken in a cookie.

*/

const USER_TOKEN_KEY = "alg:userToken"
const ANONMYOUS_ID_KEY = "alg:anonmyousId"

export class UserToken {
    private anonmyousIdStore?: ExpiringCookieStore;
    private userTokenStore: Store;

    constructor(opts: UserTokenOptions = DefaultUserTokenOptions) {
        if (opts.anonmyousId?.enabled) {
            this.anonmyousIdStore = new ExpiringCookieStore(opts.anonmyousId.lease)
        }

        if (opts.userToken?.cookie) {
            this.userTokenStore = new ExpiringCookieStore(opts.userToken.lease)
        } else {
            this.userTokenStore = new InMemoryStore()
        }
    }

    setUserToken(userToken: string) {
        this.userTokenStore.write(USER_TOKEN_KEY, userToken)
        this.anonmyousIdStore?.delete(ANONMYOUS_ID_KEY)
    }

    getUserToken() {
        const userToken = this.userTokenStore.read(USER_TOKEN_KEY)
        if (userToken) {
            return userToken;
        }

        return this.anonId()
    }

    private anonId() {
        if (!this.anonmyousIdStore) {
            return undefined
        }

        let id = this.anonmyousIdStore?.read(ANONMYOUS_ID_KEY);
        if (id) {
          return id;
        }

        return this.anonmyousIdStore?.write(ANONMYOUS_ID_KEY, this.uuid());
    }

    /**
    * Create UUID according to
    * https://www.ietf.org/rfc/rfc4122.txt
    */
    private uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

export interface Store {
  read: (key: string) => string | undefined;
  write: (key: string, value: string) => string;
  delete: (key: string) => void;
}

export { ExpiringCookieStore } from './expiringCookieStore';
export { InMemoryStore } from './inMemoryStore';

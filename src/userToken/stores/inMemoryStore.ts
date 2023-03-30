import type { Store } from '.';

export class InMemoryStore implements Store {
  private cache: Record<string, string> = {};

  read(key: string) {
    return this.cache[key];
  }

  write(key: string, value: string) {
    this.cache[key] = value;
    return value;
  }

  delete(key: string) {
    delete this.cache[key];
  }
}

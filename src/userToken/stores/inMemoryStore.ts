export class InMemoryStore {
  private cache: Record<string, string> = {};

  read(key: string) {
    return this.cache[key];
  }

  write(key: string, value: string) {
    this.cache[key] = value;
    return value;
  }
}

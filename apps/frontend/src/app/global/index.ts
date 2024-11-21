type Key = string | symbol;

export class LocalCache {
  #storage = new Map();

  get<T>(key: Key): T | null {
    const item = this.#storage.get(key) as { value: T; ttl?: number };
    if (!item) return null;

    if (item.ttl && item.ttl < Date.now()) {
      this.#storage.delete(key);
      return null;
    }

    return item.value;
  }

  set<T>(key: Key, value: T, ttl?: number) {
    this.#storage.set(key, { value, ttl: ttl ? Date.now() + ttl : undefined });
  }
}

export const localCache = new LocalCache();

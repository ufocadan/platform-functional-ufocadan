/**
 * A Least Recently Used (LRU) cache with Time-to-Live (TTL) support. Items are kept in the cache until they either
 * reach their TTL or the cache reaches its size and/or item limit. When the limit is exceeded, the cache evicts the
 * item that was least recently accessed (based on the timestamp of access). Items are also automatically evicted if they
 * are expired, as determined by the TTL.
 * An item is considered accessed, and its last accessed timestamp is updated, whenever `has`, `get`, or `set` is called with its key.
 *
 * Implement the LRU cache provider here and use the lru-cache.test.ts to check your implementation.
 * You're encouraged to add additional functions that make working with the cache easier for consumers.
 */

type LRUCacheProviderOptions = {
  ttl: number // Time to live in milliseconds
  itemLimit: number
}

type LRUCacheProvider<T> = {
  has: (key: string) => boolean
  get: (key: string) => T | undefined
  set: (key: string, value: T) => void
}

type CacheItem<T> = {
  value: T;
  expiry: number;
}

// TODO: Implement LRU cache provider
export function createLRUCacheProvider<T>({
  ttl,
  itemLimit,
}: LRUCacheProviderOptions): LRUCacheProvider<T> {
  
  const cache = new Map<string, CacheItem<T>>();

  const isExpired = (item: CacheItem<T>) => {
    return item.expiry < Date.now();
  };

  const evicOldest = () => {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  };

  return {
    has: (key: string): boolean => {
      if (!cache.has(key)) {
        return false;
      }
      const item = cache.get(key)!;
      if (isExpired(item)) {
        cache.delete(key);
        return false;
      }
      cache.delete(key);
      cache.set(key, item);
      return true;
    },
    get: (key: string): T | undefined => {
      if (!this.has(key)) {
        return undefined;
      }
      const item = cache.get(key);
      return item?.value;
    },
    set: (key: string, value: T): void => {
      if (cache.size >= itemLimit) {
        evicOldest();
      }
      const expiry = Date.now() + ttl;
      cache.set(key, {value, expiry} );
    },
  };
}

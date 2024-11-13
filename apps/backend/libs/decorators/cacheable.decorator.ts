import { redisClient } from '@libs/redis';

interface CacheableOptions {
  key?: string | ((args: unknown[]) => string);
  ttl?: number;
}

const KEY_PREFIX = 'cacheable:';

export const Cacheable = (options?: CacheableOptions): MethodDecorator => {
  return (_, propertyKey, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = options?.key ? (typeof options.key === 'string' ? `${KEY_PREFIX}${options.key}` : `${KEY_PREFIX}${options.key(args)}`) : `${KEY_PREFIX}${propertyKey.toString()}:${JSON.stringify(args)}`;
      const cachedValue = await redisClient.get(cacheKey);

      if (cachedValue) {
        return JSON.parse(cachedValue);
      }

      const result = await originalMethod.apply(this, args);
      await redisClient.set(cacheKey, JSON.stringify(result), 'EX', options?.ttl ?? 60);

      return result;
    };
  };
};
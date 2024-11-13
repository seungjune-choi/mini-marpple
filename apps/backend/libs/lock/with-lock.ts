/* eslint-disable @typescript-eslint/no-explicit-any */
import { redlock } from './lock';

export const withLock =
  (resources: string[], duration: number) =>
  async <T extends (...args: any[]) => Promise<any>>(fn: T): Promise<Awaited<ReturnType<T>>> => {
    const lock = await redlock.acquire(resources, duration);
    try {
      return await fn();
    } finally {
      await redlock.release(lock);
    }
  };

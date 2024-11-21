/* eslint-disable @typescript-eslint/no-misused-promises */
import { categoryRepository } from '../../../repositories/category';
import { localCache } from '../../global';

const CACHE_KEY = Symbol('__category__');

export const categoryMiddleware = async (req, res, next) => {
  const cached = localCache.get<{ id: number; name: string }[]>(CACHE_KEY);

  if (!cached) {
    const categories = await categoryRepository.findMany();
    localCache.set(CACHE_KEY, categories, 1000 * 60 * 60);
  }

  req.categories = localCache.get(CACHE_KEY);
  next();
};

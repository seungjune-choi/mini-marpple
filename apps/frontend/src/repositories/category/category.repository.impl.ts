import { baseClient } from '../../web-client';
import type { ICategoryRepository } from './category.repository.interface';

export class CategoryRepository implements ICategoryRepository {
  findMany(): Promise<{ id: number; name: string }[]> {
    return baseClient
      .get('/categories/v1')
      .then((res) => res.data)
      .then((data) => data.data)
      .then((data) => data.map((category) => ({ id: category.id, name: category.name })));
  }
}

export const categoryRepository = new CategoryRepository();

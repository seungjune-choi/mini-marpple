import type { CursorBasedPaginationResponse, ProductBrief } from '../../model';
import { baseClient } from '../../web-client';
import type { IProductRepository } from './product.repository.interface';

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<CursorBasedPaginationResponse<ProductBrief>> {
    return await baseClient.get('/products/v1?limit=100').then((response) => response.data.data);
  }
}

export const productRepository = new ProductRepository();

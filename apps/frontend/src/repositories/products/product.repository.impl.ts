import type { CursorBasedPaginationResponse, Product, ProductBrief } from '../../model';
import { baseClient } from '../../web-client';
import type { CreateProductRequest, IProductRepository } from './product.repository.interface';

export class ProductRepository implements IProductRepository {
  #baseUrl = '/products/v1';
  findOne(id: number, cookie?: string) {
    return baseClient
      .get(`${this.#baseUrl}/${id}`, { ...((cookie && { headers: { Cookie: cookie } }) ?? {}) })
      .then((response) => response.data.data);
  }

  // TODO : 쿼리 파라미터로 limit, cursor를 받아서 처리할 수 있도록 수정
  findAll(query: {
    limit?: number;
    cursor?: number;
    categoryId?: number;
  }): Promise<CursorBasedPaginationResponse<ProductBrief>> {
    return baseClient.get('/products/v1', { params: query }).then((response) => {
      return response.data.data;
    });
  }

  create(request: CreateProductRequest): Promise<Product> {
    return baseClient.post('/products/v1', { ...request }).then((response) => response.data.data);
  }
}

export const productRepository = new ProductRepository();

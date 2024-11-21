import type { CursorBasedPaginationResponse, Product, ProductBrief } from '../../model';

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  hidden: boolean;
  images: { id: number; isRepresentative: boolean }[];
}

export interface IProductRepository {
  findAll(query: {
    limit?: number;
    cursor?: number;
    categoryId?: number;
  }): Promise<CursorBasedPaginationResponse<ProductBrief>>;
  create(request: CreateProductRequest): Promise<Product>;
}

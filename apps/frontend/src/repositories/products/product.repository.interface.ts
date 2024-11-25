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

export interface UpdateProductRequest extends CreateProductRequest {
  id: number;
}

export type FindOneProductResponse = Omit<Product, 'images'> & {
  representativeImage: {
    id: number;
    url: string;
  };
  optionalImages: {
    id: number;
    url: string;
  }[];
};

export interface IProductRepository {
  findOne(id: number, cookie?: string): Promise<FindOneProductResponse>;
  findAll(query: {
    limit?: number;
    cursor?: number;
    categoryId?: number;
  }): Promise<CursorBasedPaginationResponse<ProductBrief>>;
  create(request: CreateProductRequest): Promise<Product>;
  update(request: UpdateProductRequest): Promise<Product>;
}

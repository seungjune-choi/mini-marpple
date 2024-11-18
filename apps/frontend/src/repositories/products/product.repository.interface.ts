import type { CursorBasedPaginationResponse, ProductBrief } from '../../model';

export interface IProductRepository {
  findAll(): Promise<CursorBasedPaginationResponse<ProductBrief>>;
}

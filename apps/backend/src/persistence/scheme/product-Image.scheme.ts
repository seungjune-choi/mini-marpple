import { BaseScheme } from '@backend/persistence/scheme/base.scheme';

export interface ProductImageScheme extends BaseScheme<number> {
  product_id: number;
  path: string;
  is_representative: boolean;
}

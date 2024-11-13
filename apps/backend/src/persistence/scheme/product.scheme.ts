import { BaseScheme } from '@backend/persistence/scheme/base.scheme';

export interface ProductScheme extends BaseScheme<number> {
  category_id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  hidden: boolean;
}

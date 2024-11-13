import { BaseScheme } from '@backend/persistence/scheme/base.scheme';

export interface OrderItemScheme extends BaseScheme<number> {
  product_id: number;
  quantity: number;
  price_at_order: number;
  order_id: number;
}
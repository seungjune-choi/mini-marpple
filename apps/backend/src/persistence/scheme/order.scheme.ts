import { BaseScheme } from '@backend/persistence/scheme/base.scheme';
import { OrderStatus } from '@backend/core';

export interface OrderScheme extends BaseScheme<number> {
  userId: number;
  merchantUid: string;
  totalPrice: number;
  shippingFee: number;
  status: OrderStatus;
}
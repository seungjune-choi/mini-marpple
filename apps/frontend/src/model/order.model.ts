import type { ProductBrief } from './product.model';
export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface Order {
  id: number;
  merchantUid: string;
  userId: number;
  totalPrice: number;
  shippingFee: number;
}

export interface OrderDetail extends Omit<Order, 'userId'> {
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  items: {
    id: number;
    product: ProductBrief;
    quantity: number;
    priceAtOrder: number;
  }[];
  payment: {
    id: number;
    amount: number;
    method: string;
    status: string;
    paymentDate: Date;
  };
}

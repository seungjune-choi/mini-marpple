import { OrderStatus } from '@backend/core';

export interface FindManyOrderResult {
  id: number;
  merchantUid: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  items: {
    id: number;
    product: {
      id: number;
      name: string;
      representativeImage: {
        id: number;
        url: string;
      };
    };
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

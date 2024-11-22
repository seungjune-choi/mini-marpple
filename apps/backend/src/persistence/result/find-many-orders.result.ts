import { OrderStatus } from '@backend/core';

export interface FindManyOrderResult {
  id: number;
  merchantUid: string;
  totalPrice: number;
  shoppingFee: number;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  items: {
    id: number;
    product: {
      id: number;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      price: number;
      description: string;
      hidden: boolean;
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

import type { Order, ResponseEntity } from '../../model';
import { baseClient } from '../../web-client';
import type { IOrderRepository } from './order.repository.interface';

export class OrderRepository implements IOrderRepository {
  #baseUrl = '/orders/v1';
  create(cartId: number): Promise<Order> {
    return baseClient.post<ResponseEntity<Order>>(`${this.#baseUrl}/carts/${cartId}`).then((res) => res.data.data);
  }
}

export const orderRepository = new OrderRepository();

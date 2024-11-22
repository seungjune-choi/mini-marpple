import type { CursorBasedPaginationResponse, Order, OrderDetail, OrderStatus, ResponseEntity } from '../../model';
import { baseClient } from '../../web-client';
import type { IOrderRepository } from './order.repository.interface';

export class OrderRepository implements IOrderRepository {
  #baseUrl = '/orders/v1';

  create(cartId: number): Promise<Order> {
    return baseClient.post<ResponseEntity<Order>>(`${this.#baseUrl}/carts/${cartId}`).then((res) => res.data.data);
  }

  findMany(
    query: {
      limit?: number;
      cursor?: number;
      status?: OrderStatus;
    },
    cookie?: string,
  ): Promise<CursorBasedPaginationResponse<OrderDetail>> {
    return baseClient
      .get<ResponseEntity<CursorBasedPaginationResponse<OrderDetail>>>(this.#baseUrl, {
        params: query,
        ...((cookie && { headers: { Cookie: cookie } }) ?? {}),
      })
      .then((res) => res.data.data);
  }
}

export const orderRepository = new OrderRepository();

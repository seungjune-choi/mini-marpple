import type { CursorBasedPaginationResponse, Order, OrderDetail, OrderStatus } from '../../model';

export interface IOrderRepository {
  create(cartId: number): Promise<Order>;
  findMany(
    query: {
      limit?: number;
      cursor?: number;
      status?: OrderStatus;
    },
    cookie?: string,
  ): Promise<CursorBasedPaginationResponse<OrderDetail>>;
}

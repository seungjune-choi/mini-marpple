import type { Order } from '../../model';

export interface IOrderRepository {
  create(cartId: number): Promise<Order>;
}

import { baseClient } from '../../web-client';
import type { ICartRepository } from './cart.repository.interface';

export class CartRepository implements ICartRepository {
  async addItem(productId: number, quantity: number): Promise<unknown> {
    return await baseClient.post('/carts/v1/items', { productId, quantity }).then((res) => res.data.data);
  }
}

export const cartRepository = new CartRepository();

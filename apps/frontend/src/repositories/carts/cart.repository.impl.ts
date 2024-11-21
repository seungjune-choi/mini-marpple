import type { Cart } from '../../model';
import { baseClient } from '../../web-client';
import type { ICartRepository } from './cart.repository.interface';

export class CartRepository implements ICartRepository {
  async addItem(productId: number, quantity: number): Promise<unknown> {
    return await baseClient.post('/carts/v1/items', { productId, quantity }).then((res) => res.data.data);
  }

  // TODO : csr 일 때, ssr 일 때 다르게 처리해야함
  async findOne(cookie?: any): Promise<Cart> {
    return await baseClient.get('/carts/v1', cookie && { headers: { Cookie: cookie } }).then((res) => res.data.data);
  }

  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    return await baseClient.patch(`/carts/v1/items/${itemId}`, { quantity }).then((res) => res.data.data);
  }

  async deleteItem(itemId: number) {
    return await baseClient.delete(`/carts/v1/items/${itemId}`).then((res) => res.data.data);
  }
}

export const cartRepository = new CartRepository();

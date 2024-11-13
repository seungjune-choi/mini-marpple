import { Injectable } from '@libs/decorators';
import { CartRepository } from '@backend/persistence';
import { Cart, Product } from 'src/core';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async findOne(userId: number): Promise<Cart | null> {
    return await this.cartRepository.findOneByUserId(userId);
  }

  async addItem(target: Cart, product: Product, quantity: number): Promise<Cart> {
    target.addItem(product, quantity);
    return await this.cartRepository.save(target);
  }

  async removeItem(target: Cart, itemId: number): Promise<Cart> {
    target.removeItem(itemId);
    return await this.cartRepository.save(target);
  }

  async updateItemQuantity(target: Cart, itemId: number, quantity: number): Promise<void> {
    target.updateQuantity(itemId, quantity);
    await this.cartRepository.save(target);
  }
}

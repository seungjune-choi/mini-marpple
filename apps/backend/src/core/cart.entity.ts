import { BaseEntity } from '@backend/core/base.entity';
import { Exclude, Expose } from 'class-transformer';
import { CartItem } from '@backend/core/cart-item.entity';
import { Product } from '@backend/core/product.entity';
import { ExcludeMethod } from '@libs/types';
import { BadRequestException } from '@libs/exceptions/http';
import { map, pipe, sum } from '@fxts/core';

export class Cart extends BaseEntity<number> {
  @Expose({ name: 'user_id' })
  userId!: number;

  @Exclude()
  items: CartItem[] = [];

  constructor(args: Partial<Cart>) {
    super();
    Object.assign(this, args);
  }

  static new() {
    return new Cart({});
  }

  static from(args: ExcludeMethod<Cart>) {
    return new Cart(args);
  }

  @Exclude()
  addItem(product: Product, quantity: number) {
    const existingItem = this.items.find((item) => item.productId === product.id);
    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      this.items.push(CartItem.new({ cartId: this.id!, product, quantity }));
    }
  }

  @Exclude()
  removeItem(itemId: number) {
    const index = this.items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new BadRequestException('삭제할 상품이 존재하지 않습니다.');
    }

    this.items.splice(index, 1);
  }

  @Exclude()
  updateQuantity(itemId: number, quantity: number) {
    const item = this.items.find((item) => item.id === itemId);
    if (!item) {
      throw new BadRequestException('수량을 변경할 상품이 존재하지 않습니다.');
    }

    item.updateQuantity(quantity);
  }

  @Exclude()
  calculateItemsPrice = () =>
    pipe(
      this.items,
      map((item) => item.calculatePrice()),
      sum,
    );

  @Exclude()
  clear() {
    this.items.forEach((item) => item.clear());
    return this;
  }
}

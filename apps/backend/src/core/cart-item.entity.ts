import { BaseEntity } from '@backend/core/base.entity';
import { Exclude, Expose } from 'class-transformer';
import { Product } from '@backend/core/product.entity';
import { ExcludeMethod } from '@libs/types';
import { UnprocessableEntityException } from '@libs/exceptions/http';

export class CartItem extends BaseEntity<number> {
  @Expose({ name: 'cart_id' })
  cartId!: number;

  @Expose({ name: 'product_id' })
  productId!: number;

  @Expose({ name: 'quantity' })
  quantity!: number;

  @Exclude()
  product!: Product;

  constructor(args: Partial<CartItem>) {
    super();
    Object.assign(this, args);
  }

  static new(args: Pick<CartItem, 'cartId' | 'quantity' | 'product'>) {
    return new CartItem({
      ...args,
      productId: args.product.id,
    });
  }

  static from(args: ExcludeMethod<CartItem>) {
    return new CartItem(args);
  }

  @Exclude()
  increaseQuantity = (quantity: number) => {
    if (this.quantity + quantity > this.product.stockQuantity) {
      throw new UnprocessableEntityException(
        `${this.product.name}는 최대 ${this.product.stockQuantity}개까지 구매 가능합니다.`,
      );
    }
    this.quantity += quantity;
  };

  @Exclude()
  decreaseQuantity = (quantity: number) => {
    if (this.quantity - quantity < 0) {
      throw new UnprocessableEntityException('수량은 0개 미만으로 설정할 수 없습니다.');
    }

    this.quantity -= quantity;
  };

  @Exclude()
  updateQuantity = (quantity: number) => {
    if (quantity < 0) {
      throw new UnprocessableEntityException('수량은 0개 미만으로 설정할 수 없습니다.');
    }

    if (quantity > this.product.stockQuantity) {
      throw new UnprocessableEntityException(
        `${this.product.name}는 최대 ${this.product.stockQuantity}개까지 구매 가능합니다.`,
      );
    }

    this.quantity = quantity;
  };

  @Exclude()
  calculatePrice = () => this.product.price * this.quantity;

  @Exclude()
  clear() {
    this.deletedAt = new Date();
  }
}

import { BaseEntity } from '@backend/core/base.entity';
import { Exclude, Expose } from 'class-transformer';
import { CartItem } from '@backend/core/cart-item.entity';
import { Product } from '@backend/core/product.entity';

export class OrderItem extends BaseEntity<number> {
  @Expose({ name: 'product_id' })
  productId!: number;

  @Expose({ name: 'quantity' })
  quantity!: number;

  @Expose({ name: 'price_at_order' })
  priceAtOrder!: number;

  @Expose({ name: 'order_id' })
  orderId!: number;

  @Exclude()
  product!: Product;

  static fromCartItem(cartItem: CartItem): OrderItem {
    const orderItem = new OrderItem();
    orderItem.productId = cartItem.product.id!;
    orderItem.quantity = cartItem.quantity;
    orderItem.priceAtOrder = cartItem.product.price;
    return orderItem;
  }

  static from(args: Partial<OrderItem>): OrderItem {
    const orderItem = new OrderItem();
    Object.assign(orderItem, args);
    return orderItem;
  }
  
  setOrderId(orderId: number): this {
    this.orderId = orderId;

    return this;
  }
}
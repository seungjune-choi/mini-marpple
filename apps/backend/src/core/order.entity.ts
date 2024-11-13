import { BaseEntity } from '@backend/core/base.entity';
import { OrderItem } from '@backend/core/order-item.entity';
import { Exclude, Expose } from 'class-transformer';
import { Cart } from '@backend/core/cart.entity';
import { OrderStatus } from '@backend/core/order-status';

export class Order extends BaseEntity<number> {
  @Expose({ name: 'merchant_uid' })
  merchantUid!: string;

  @Expose({ name: 'user_id' })
  userId!: number;

  @Expose({ name: 'total_price' })
  totalPrice!: number;

  @Expose({ name: 'shipping_fee' })
  shippingFee!: number;

  @Expose({ name: 'status' })
  status!: OrderStatus;

  @Exclude()
  items: OrderItem[] = [];

  static from(args: Partial<Order>): Order {
    return Object.assign(new Order(), args);
  }

  static fromCart(cart: Cart, shippingFee: number): Order {
    const order = new Order();
    order.merchantUid = `ORD${Date.now()}`;
    order.userId = cart.userId;
    order.totalPrice = cart.calculateItemsPrice() + shippingFee;
    order.shippingFee = shippingFee;
    order.items = cart.items.map(OrderItem.fromCartItem);
    order.status = OrderStatus.PENDING;
    return order;
  }

  @Exclude()
  complete(): this {
    this.status = OrderStatus.COMPLETED;
    this.updatedAt = new Date();
    return this;
  }

  @Exclude()
  cancel(): this {
    this.status = OrderStatus.CANCELED;
    this.updatedAt = new Date();
    return this;
  }
}

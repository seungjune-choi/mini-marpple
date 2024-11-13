import { Exclude, Expose } from 'class-transformer';
import { PaymentStatus } from '@backend/core/payment-status';

export class Payment {
  @Expose({ name: 'id' })
  id!: number;

  @Expose({ name: 'order_id' })
  orderId!: number;

  @Expose({ name: 'user_id' })
  userId!: number;

  @Expose({ name: 'amount' })
  amount!: number;

  @Expose({ name: 'payment_method' })
  paymentMethod!: string;

  @Expose({ name: 'payment_date' })
  paymentDate!: Date;

  @Expose({ name: 'created_at' })
  createdAt!: Date;

  @Expose({ name: 'status' })
  status!: PaymentStatus;

  static new(args: Partial<Payment>): Payment {
    return Object.assign(new Payment(), args);
  }

  static from(args: Partial<Payment>): Payment {
    return Object.assign(new Payment(), args);
  }

  @Exclude()
  cancel(): this {
    this.status = PaymentStatus.CANCELLED;
    return this;
  }
}

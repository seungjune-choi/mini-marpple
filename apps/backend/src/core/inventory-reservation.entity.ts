import { Expose } from 'class-transformer';
import { InventoryReservationStatus } from './inventory-reservation-status';
import { LocalDateTime } from '@js-joda/core';
import { DateTransformer } from '@libs/utils';

export class InventoryReservation {
  @Expose({ name: 'id' })
  id?: number;

  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @Expose({ name: 'expires_at' })
  expiresAt?: Date;

  @Expose({ name: 'product_id' })
  productId!: number;

  @Expose({ name: 'quantity' })
  quantity!: number;

  @Expose({ name: 'order_id' })
  orderId!: number;

  @Expose({ name: 'status' })
  status!: InventoryReservationStatus;

  static new(args: Pick<InventoryReservation, 'productId' | 'quantity' | 'orderId'>) {
    return Object.assign(new InventoryReservation(), {
      ...args,
      status: InventoryReservationStatus.PENDING,
      // 기본적으로 15분 후 만료
      expiresAt: DateTransformer.toDate(LocalDateTime.now().plusMinutes(15)),
    });
  }

  static from(args: Partial<InventoryReservation>): InventoryReservation {
    return Object.assign(new InventoryReservation(), args);
  }

  release() {
    this.status = InventoryReservationStatus.COMPLETED;
    return this;
  }
}

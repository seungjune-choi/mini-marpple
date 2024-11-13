import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource, TransactionClient } from '@libs/database';
import { InventoryReservation } from '@backend/core/inventory-reservation.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { InventoryReservationStatus } from '@backend/core/inventory-reservation-status';
import { InventoryReservationScheme } from './scheme';
import { map, pipe, toArray } from '@fxts/core';

@Injectable()
export class InventoryReservationRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  async findManyByOrderId(
    orderId: number,
    status: InventoryReservationStatus,
    tx?: TransactionClient,
  ): Promise<InventoryReservation[]> {
    return await (tx ?? this.dataSource).$query<InventoryReservationScheme>`
      SELECT 
        *
      FROM 
        inventory_reservations
      WHERE 
        order_id = ${orderId} AND status = ${status}
    `.then((scheme) =>
      pipe(
        scheme,
        map((s) => plainToInstance(InventoryReservation, s)),
        toArray,
      ),
    );
  }

  async aggregateReservedQuantity(productIds: number[]): Promise<Map<number, number>> {
    return await this.dataSource.$query<{ productId: number; quantity: number }>`
      SELECT 
        product_id as "productId", 
        SUM(quantity)::INTEGER as "quantity"
      FROM 
        inventory_reservations
      WHERE 
        ${this.dataSource.$in('product_id', productIds)} AND status = ${InventoryReservationStatus.PENDING}
      GROUP BY 
        product_id
      `.then((res) => new Map(res.map((r) => [r.productId, r.quantity])));
  }

  async createMany(targets: InventoryReservation[], tx?: TransactionClient) {
    return await (tx ?? this.dataSource).$query<{ id: number }>`
      INSERT INTO 
        inventory_reservations 
        ${this.dataSource.$values(targets.map((reserve) => instanceToPlain(reserve, { exposeUnsetFields: false })))} 
      RETURNING id`.then((res) => ({ affectedRows: res.length }));
  }

  async release(orderId: number, tx?: TransactionClient) {
    return await (tx ?? this.dataSource).$query`
      UPDATE 
        inventory_reservations
      SET
        status = ${InventoryReservationStatus.COMPLETED}
      WHERE
        order_id = ${orderId}
      RETURNING id
      `.then((res) => ({ affectedRows: res.length }));
  }
}

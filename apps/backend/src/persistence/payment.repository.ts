import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource, TransactionClient } from '@libs/database';
import { Payment } from '@backend/core';
import { PaymentScheme } from '@backend/persistence/scheme';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  async findOneByOrderId(orderId: number, tx?: TransactionClient): Promise<Payment | null> {
    return await (tx ?? this.dataSource).$query<PaymentScheme>`SELECT * FROM payments WHERE order_id = ${orderId}`
      .then(([scheme]) => (scheme ? plainToInstance(Payment, scheme) : null))
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  async save(payment: Payment, tx?: TransactionClient): Promise<Payment> {
    if (tx) {
      return payment.id ? this.update(payment, tx) : this.create(payment, tx);
    } else {
      return this.dataSource.$transaction(async (tx) => {
        return payment.id ? this.update(payment, tx) : this.create(payment, tx);
      });
    }
  }

  create(payment: Payment, tx: TransactionClient): Promise<Payment> {
    return tx.$query<PaymentScheme>`
      INSERT INTO payments ${this.dataSource.$values([instanceToPlain(payment, { exposeUnsetFields: false })])} RETURNING *`
      .then(([scheme]) => plainToInstance(Payment, scheme))
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  update(payment: Payment, tx: TransactionClient): Promise<Payment> {
    return tx.$query<PaymentScheme>`
      UPDATE payments ${this.dataSource.$set(instanceToPlain(payment, { exposeUnsetFields: false }))} WHERE id = ${payment.id} RETURNING *`
      .then(([scheme]) => plainToInstance(Payment, scheme))
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}

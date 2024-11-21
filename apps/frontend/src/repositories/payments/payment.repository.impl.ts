import type { ResponseEntity } from '../../model';
import { baseClient } from '../../web-client';
import type { IPaymentRepository, PreparePaymentResponse } from './payment.repository.interface';

export class PaymentRepository implements IPaymentRepository {
  #baseUrl = '/payments/v1';
  prepare(orderId: number): Promise<PreparePaymentResponse> {
    return baseClient
      .post<ResponseEntity<PreparePaymentResponse>>(`${this.#baseUrl}/prepare/order/${orderId}`)
      .then((res) => res.data.data);
  }

  complete(orderId: number): Promise<void> {
    return baseClient
      .post<ResponseEntity<void>>(`${this.#baseUrl}/complete/order/${orderId}`)
      .then((res) => res.data.data);
  }
}

export const paymentRepository = new PaymentRepository();

export interface PreparePaymentResponse {
  merchantUid: string;
  amount: number;
  shippingFee: number;
  buyerEmail: string;
  buyerName: string;
  buyerTel: string;
  buyerAddr: string;
  buyerPostcode: string;
}

export interface IPaymentRepository {
  prepare(orderId: number): Promise<PreparePaymentResponse>;
  complete(orderId: number): Promise<void>;
}

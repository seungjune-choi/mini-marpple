export interface PaymentScheme {
  id: number;
  order_id: number;
  user_id: number;
  amount: number;
  payment_date: Date;
  payment_method: string;
  status: string;
  created_at: Date;
}
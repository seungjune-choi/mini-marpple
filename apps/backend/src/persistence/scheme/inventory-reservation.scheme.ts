import { InventoryReservationStatus } from '@backend/core/inventory-reservation-status';

export interface InventoryReservationScheme {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  status: InventoryReservationStatus;
  expires_at: Date;
  created_at: Date;
}

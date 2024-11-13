import { OrderScheme } from '@backend/persistence/scheme/order.scheme';
import { OrderItemScheme } from '@backend/persistence/scheme/order-item.scheme';
import { ProductScheme } from '@backend/persistence/scheme/product.scheme';

export interface FindOneOrderAssociationScheme extends OrderScheme {
  _: {
    order_items: (OrderItemScheme & {
      _: { product: ProductScheme };
    })[];
  };
}
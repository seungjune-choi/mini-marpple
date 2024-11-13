import { CartScheme } from '@backend/persistence/scheme/cart.scheme';
import { CartItemScheme } from '@backend/persistence/scheme/cart-item.scheme';
import { ProductScheme } from '@backend/persistence/scheme/product.scheme';
import { ProductImageScheme } from '@backend/persistence/scheme/product-Image.scheme';

export interface FindOneCartAssociationScheme extends CartScheme {
  _: {
    cart_items: (CartItemScheme & {
      _: { product: ProductScheme & { _: { product_images: ProductImageScheme[] } } };
    })[];
  };
}

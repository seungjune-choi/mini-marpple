import { ProductImageScheme } from './product-Image.scheme';
import { ProductScheme } from './product.scheme';

export interface FindOneAssociationScheme extends ProductScheme {
  _: {
    product_images: ProductImageScheme[];
  };
}

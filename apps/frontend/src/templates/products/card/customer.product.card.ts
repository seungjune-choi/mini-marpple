import { on } from 'rune-ts';
import type { Product, ProductBrief } from '../../../model';
import { AddCartEvent, BaseProductCard, type BaseProductCardProps } from './base.product.card';
import { BindModel } from '../../../experimental';

export interface CustomerProductCardProps extends BaseProductCardProps {
  onAddCart: (productId: number) => Promise<void>;
}

export class CustomerProductCard extends BaseProductCard<CustomerProductCardProps> {
  @on(AddCartEvent)
  async addCart(e: AddCartEvent) {
    const productId = e.detail.productId;
    await this.data.onAddCart(productId);
  }

  static fromBrief(product: ProductBrief, handleAddCard: CustomerProductCardProps['onAddCart']): CustomerProductCard {
    return new CustomerProductCard({
      model: new BindModel<Partial<Product>>({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: [
          {
            id: product.representativeImage.id,
            src: product.representativeImage.url,
            isRepresentative: true,
          },
        ],
      }),
      enableCartButton: true,
      onAddCart: handleAddCard,
    });
  }
}

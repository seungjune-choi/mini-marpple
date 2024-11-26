import { html, on, type Html } from 'rune-ts';
import { BaseProductCard } from './base.product.card';
import type { Product, ProductBrief } from '../../../model';
import { BindModel } from '../../../experimental';

export class AdminProductCard extends BaseProductCard {
  protected override template(): Html {
    return html` <div data-id="${this.data.model.value.id}">${this.baseTemplate()}</div> `;
  }

  @on('click')
  handleCardClick(e) {
    window.location.href = `/admin/product-edit?id=${e.currentTarget.dataset.id}`;
  }

  static fromBrief(product: ProductBrief) {
    return new AdminProductCard({
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
    });
  }
}

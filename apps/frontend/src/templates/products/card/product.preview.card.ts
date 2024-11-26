import { html, type Html } from 'rune-ts';
import type { BindModel } from '../../../experimental';
import type { Product } from '../../../model';
import { BaseProductCard } from './base.product.card';

export interface ProductCardProps {
  model: BindModel<Partial<Product>>;
}

export class ProductPreviewCard extends BaseProductCard {
  protected override template(): Html {
    return html` <div style="width: 300px">${this.baseTemplate()}</div> `;
  }
}

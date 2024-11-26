import { html, View } from 'rune-ts';
import type { ProductBrief } from '../../../model';
import type { ListView } from '../../../components/pagination-container';
import { fx } from '@fxts/core';
import style from './product-list.module.scss';
import { CustomerProductCard } from '../card/customer.product.card';
import { cartRepository } from '../../../repositories/carts';

export class CustomerProductListView
  extends View<{ items: ProductBrief[] }>
  implements ListView<ProductBrief, { items: ProductBrief[] }>
{
  protected override template() {
    return html`
      <div class="${style['product-list-container']}">
        ${fx(this.data.items)
          .map((p) => CustomerProductCard.fromBrief(p, this.handleAddToCart.bind(this)))
          .toArray()}
      </div>
    `;
  }

  async handleAddToCart(productId: number) {
    await cartRepository.addItem(productId, 1);
  }

  rerender(items: ProductBrief[]): void {
    this.data.items = items;
    this.redraw();
  }
}

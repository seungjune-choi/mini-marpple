import { fx } from '@fxts/core';
import { View, html } from 'rune-ts';
import type { ProductBrief } from '../../../model';
import { AdminProductCard } from '../card/admin.product.card';
import style from './product-list.module.scss';
import type { ListView } from '../../../components/pagination-container';

export class AdminProductListView
  extends View<{ items: ProductBrief[] }>
  implements ListView<ProductBrief, { items: ProductBrief[] }>
{
  protected override template() {
    return html`
      <div class="${style['product-list-container']}">
        ${fx(this.data.items).map(AdminProductCard.fromBrief).toArray()}
      </div>
    `;
  }

  rerender(items: ProductBrief[]): void {
    this.data.items = items;
    this.redraw();
  }
}

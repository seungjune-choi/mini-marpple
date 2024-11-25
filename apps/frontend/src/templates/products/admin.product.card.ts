import { html, on, type Html } from 'rune-ts';
import { BaseProductCard } from './base.product.card';

export class AdminProductCard extends BaseProductCard {
  protected override template(): Html {
    return html` <div data-id="${this.data.model.value.id}">${this.baseTemplate()}</div> `;
  }

  @on('click')
  handleCardClick(e) {
    window.location.href = `/product-edit?id=${e.currentTarget.dataset.id}`;
  }
}

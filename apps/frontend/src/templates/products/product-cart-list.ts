import { html, View, type Html } from 'rune-ts';
import type { ProductBrief } from '../../model';
import { map, pipe, toArray } from '@fxts/core';
import { Card } from '../../components/card';
import style from './product-list.module.scss';

export interface ProductCartListProps {
  items: ProductBrief[];
}

export class ProductCardList extends View<ProductCartListProps> {
  protected override template(): Html {
    console.log(this.data.items);
    return html`<div class="${style['product-list-container']}">
      ${pipe(this.data.items, map(createProductBriefCard), toArray)}
    </div>`;
  }

  async rerender(items: ProductBrief[]) {
    this.data.items = items;
    console.log(items);
    await this.redrawAsync();
  }
}

function createProductBriefCard(target: ProductBrief) {
  return new Card({
    body: productBriefCardBody(target),
    footer: productBriefCardFooter(target),
  });
}

function productBriefCardBody(target: ProductBrief): Html {
  return html`<div class="${style['product-brief-card-body']}">
    <img src="${target.representativeImage.url}" alt="${target.representativeImage.url}" />
  </div>`;
}

function productBriefCardFooter(target: ProductBrief): Html {
  return html`<div class="${style['product-brief-card-footer']}">
    <div class="${style['cart-button']}" data-id="${target.id}"><i class="fas fa-shopping-cart"></i></div>
    <div class="${style.name}">${target.name}</div>
    <div class="${style.description}">${target.description}</div>
    <div class="${style.price}">${target.price} 원</div>
  </div>`;
}

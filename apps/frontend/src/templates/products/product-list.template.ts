import { html, on, View, type Html } from 'rune-ts';
import type { CursorBasedPaginationResponse, ProductBrief } from '../../model';
import { Card } from '../../components/card';
import style from './product-list.module.scss';
import { pipe } from '@fxts/core';
import { cartRepository } from '../../repositories/carts';

export class ProductListTemplate extends View<CursorBasedPaginationResponse<ProductBrief>> {
  protected override template(): Html {
    return html`
      <div class="${style['product-list-container']}">
        ${pipe(this.data.items, (items) =>
          items.map(
            (item) =>
              new Card({
                body: productBriefCardBody(item),
                footer: productBriefCardFooter(item),
              }),
          ),
        )}
      </div>
    `;
  }

  @on('click', `.${style['cart-button']}`)
  async handleCartButtonClick(e) {
    // TODO: 장바구니에 상품 추가
    console.log(e.currentTarget.dataset.id);
    await cartRepository.addItem(+e.currentTarget.dataset.id, 1);
  }
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

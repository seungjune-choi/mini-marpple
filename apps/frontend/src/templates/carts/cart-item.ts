import { CustomEventWithDetail, html, on, View, type Html } from 'rune-ts';
import type { Cart } from '../../model';
import type { ArrayElement } from '../../../../../packages/types/array-element';
import style from './cart-item.scss';

export class QuantityChangeButtonClickedEvent extends CustomEventWithDetail<{ itemId: number }> {}
export class CartItemDeleteEvent extends CustomEventWithDetail<{ itemId: number }> {}

export class CartItem extends View<ArrayElement<Cart['items']>> {
  protected override template(): Html {
    return html`
      <div class="${style['cart-item']}">
        <img src="${this.data.product.representativeImage.url}" alt="${this.data.product.name}" />
        <button class="${style['delete-button']}" data-id="${this.data.id}">x</button>
        <div class="${style['meta-data']}">
          <div class=${style.name}>${this.data.product.name}</div>
          <div class=${style.description}>${this.data.product.description}</div>
          <div class=${style.footer}>
            <div class=${style['cart-item-price']}>
              ${this.data.product.price.toLocaleString('ko-KR')} 원 | ${this.data.quantity} 개
            </div>
            <div>
              <div class=${style['cart-item-quantity']}>수량 변경</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  @on('click', `.${style['cart-item-quantity']}`)
  handleQuantityChange() {
    this.dispatchEvent(QuantityChangeButtonClickedEvent, { bubbles: true, detail: { itemId: this.data.id } });
  }

  @on('click', `.${style['delete-button']}`)
  handleDelete(e) {
    this.dispatchEvent(CartItemDeleteEvent, { bubbles: true, detail: { itemId: +e.currentTarget.dataset.id } });
  }
}

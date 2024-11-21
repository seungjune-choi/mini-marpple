import { CustomEventWithoutDetail, html, on, View, type Html } from 'rune-ts';
import type { CartItem as CartItemModel } from '../../model';
import { CartItem, CartItemDeleteEvent, QuantityChangeButtonClickedEvent } from './cart-item';
import style from './cart-item.scss';
import { map, pipe, toArray } from '@fxts/core';
import { cartRepository } from '../../repositories/carts';
import { ChangeQuantityModal } from './change-quantity.modal';

export class CartChangedEvent extends CustomEventWithoutDetail {}

interface CartItemListProps {
  items: CartItemModel[];
}

export class CartItemList extends View<CartItemListProps> {
  private readonly modal = new ChangeQuantityModal({});

  protected override template(): Html {
    return html`
      <div class="${style['scroll-container']}">
        <div class="${style['cart-item-container']}">
          <p style="margin-bottom: 10px;">상품 목록</p>
          <div style="border-top: 1px solid black;"></div>
          ${pipe(
            this.data.items,
            map((i) => new CartItem(i)),
            toArray,
          )}
          <div style="border-top: 1px solid black;"></div>
        </div>
        ${this.modal}
      </div>
    `;
  }

  async rerender(items: CartItemModel[]): Promise<void> {
    this.data.items = items;
    await this.redrawAsync();
  }

  @on(QuantityChangeButtonClickedEvent)
  handleQuantityChange(event: QuantityChangeButtonClickedEvent) {
    const { itemId } = event.detail;
    this.modal.setItem(this.data.items.find((i) => i.id === itemId)!);
    this.modal.open();
  }

  @on(CartItemDeleteEvent)
  async handleItemDelete(event: CartItemDeleteEvent) {
    const { itemId } = event.detail;
    await cartRepository.deleteItem(itemId).catch(() => {
      return alert('상품 삭제에 실패했습니다.');
    });

    // 상태 변경을 위한 이벤트 발생
    this.dispatchEvent(CartChangedEvent, { bubbles: true });
  }
}

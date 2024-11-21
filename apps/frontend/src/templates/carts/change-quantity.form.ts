import { html, on, View, type Html } from 'rune-ts';
import type { CartItem } from '../../model';
import style from './change-quantity.module.scss';
import { Button } from '../../components/button';
import { CountChangedEvent, Counter } from '../../components/counter';
import { CloseModal } from '../../components';
import { cartRepository } from '../../repositories/carts';
import { CartChangedEvent } from './cart-item-list';

export interface ChangeQuantityProps {
  item: CartItem;
}

export class ChangeQuantityForm extends View<ChangeQuantityProps> {
  private readonly counter = new Counter({ value: this.data.item.quantity });

  protected override template(): Html {
    return html`
      <div class="${style.container}">
        <div class="${style['info-box']}">
          <div class="${style['product-image']}">
            <img src="${this.data.item.product.representativeImage.url}" alt="${this.data.item.product.name}" />
          </div>
          <div class="${style.info}">
            <h2 class="${style.title}">${this.data.item.product.name}</h2>
            <p class="${style.description}">${this.data.item.product.description}</p>
            <p class="${style.price}">${this.data.item.product.price.toLocaleString('ko-KR')}원</p>
          </div>
        </div>

        <div class="${style.actions}">${this.counter}</div>

        <div class="${style['total-price']}">
          <span>총 상품 금액</span>
          <strong>${(this.data.item.product.price * this.counter.data.value).toLocaleString('ko-KR')}원</strong>
        </div>

        <div class="${style['button-group']}">
          ${new Button({ name: '취소', color: 'none', variant: 'contained', onClick: this.handleCancel.bind(this) })}
          ${new Button({ name: '변경', color: 'none', onClick: this.handleChange.bind(this) })}
        </div>
      </div>
    `;
  }

  @on(CountChangedEvent)
  private handleCountChanged(e: CountChangedEvent) {
    this.counter.data.value = e.detail.value;
    // Q : 이 컴포넌트에서 카운터가 바뀌면 redraw 해야하는 부분은 상품 금액만 바뀌는데 최적화를 위해서 상품 금액을 다른 컴포넌트로 분리해야할까요?
    this.redraw();
  }

  private handleCancel() {
    this.dispatchEvent(CloseModal, { bubbles: true });
  }

  private async handleChange() {
    const newQuantity = this.counter.data.value;
    await cartRepository.updateQuantity(this.data.item.id, newQuantity).catch(() => {
      return alert('수량 변경에 실패했습니다.');
    });

    this.dispatchEvent(CartChangedEvent, { bubbles: true });
    this.dispatchEvent(CloseModal, { bubbles: true });
  }
}

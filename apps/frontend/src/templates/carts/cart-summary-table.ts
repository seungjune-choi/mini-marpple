import { CustomEventWithoutDetail, html, View, type Html } from 'rune-ts';
import type { CartSummary } from '../../model';
import style from './cart-summary.module.scss';
import { SummaryTable } from '../../components/table';
import { Button } from '../../components/button';

export interface CartSummaryTableProps {
  summary: CartSummary;
}

export class OrderEvent extends CustomEventWithoutDetail {}

export class CartSummaryTable extends View<CartSummaryTableProps> {
  protected override template(): Html {
    return html`
      <div class="${style['cart-summary-container']}">
        ${new SummaryTable([
          { label: '총 수량', value: `${this.data.summary.totalItems.toLocaleString('ko-KR')} 개` },
          { label: '총 상품금액', value: `${this.data.summary.totalProductPrice.toLocaleString('ko-KR')} 원` },
          { label: '배송비', value: `${this.data.summary.shippingFee.toLocaleString('ko-KR')} 원` },
          { label: '총 가격', value: `${this.data.summary.totalOrderPrice.toLocaleString('ko-KR')} 원` },
        ])}
        ${new Button({ name: '주문하기', variant: 'contained', onClick: this.handleOrderButtonClick.bind(this) })}
      </div>
    `;
  }

  async rerender(summary: CartSummary): Promise<void> {
    this.data.summary = summary;
    await this.redrawAsync();
  }

  private handleOrderButtonClick() {
    this.dispatchEvent(OrderEvent, { bubbles: true });
  }
}

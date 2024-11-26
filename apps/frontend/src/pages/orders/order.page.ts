import { html, on, View, type Html } from 'rune-ts';
import { OrderStatus, type OrderDetail } from '../../model';
import { orderRepository } from '../../repositories/orders';
import { MetaView } from '@rune-ts/server';
import { map, pipe, toArray } from '@fxts/core';
import style from './order.card.module.scss';
import { Button } from '../../components/button';
import { OrderCancelConfirmEvent, OrderCancelModal } from './order.cancel.modal';
import { paymentRepository } from '../../repositories/payments';
import { BasePage, type BasePageProps } from '../base.page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export interface OrderPageProps extends BasePageProps {
  items: OrderDetail[];
  cursor: number;
}
export const statusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return '결제 완료';
    case OrderStatus.PENDING:
      return '결제 대기중';
    case OrderStatus.CANCELED:
      return '주문 취소';
    default:
      return '알 수 없음';
  }
};

export class OrderPage extends BasePage<OrderPageProps> {
  private modal = new OrderCancelModal();

  // TODO: 컴포넌트 분리
  protected override content(): Html | View {
    return html`
      <div class="${style['order-list']}">
        ${pipe(
          this.data.items,
          map(
            (o) => html`
              <div class="${style['order-card']}">
                <div class="${style.header}">
                  <h4>주문번호: ${o.merchantUid}</h4>
                  <p>주문일시: ${new Date(o.updatedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                  <p class="${style.status} ${style[o.status]}">주문상태: ${statusText(o.status)}</p>
                </div>
                ${o.status !== OrderStatus.CANCELED
                  ? html`<div class="${style['cancel-wrapper']}">${this.createCancelButton(o.id)}</div>`
                  : ''}
                <div class="${style.details}">
                  ${pipe(
                    o.items,
                    map(
                      (i) => html`
                        <div class="${style.item} ${o.status === OrderStatus.CANCELED ? style.cancelled : ''}">
                          <div class="${style['image-wrapper']}">
                            <img src="${i.product.representativeImage.url}" alt="${i.product.name}" />
                            <span class="${style.name}">${i.product.name}</span>
                          </div>
                          <div class="${style['price-wrapper']}">
                            <div>
                              <span class="${style.price}">${i.priceAtOrder} 원</span>
                              <span class="${style.quantity}"> x ${i.quantity} 개</span>
                            </div>
                            <span class="${style.price}">${+i.priceAtOrder * +i.quantity} 원</span>
                          </div>
                        </div>
                      `,
                    ),
                    toArray,
                  )}
                </div>
                <div class="${style.total}">
                  <div class="${style.with}">
                    <strong>상품 총액: </strong>
                    <strong>${(+o.totalPrice).toFixed()} 원</strong>
                  </div>
                  <div class="${style.with}">
                    <strong>배송비: </strong>
                    <strong>${(+o.shippingFee).toFixed()} 원</strong>
                  </div>
                  <div class="${style.with}">
                    <strong>총 결제 금액: </strong>
                    <strong>${(+o.totalPrice + +o.shippingFee).toFixed()} 원</strong>
                  </div>
                </div>
              </div>
            `,
          ),
          toArray,
        )}
      </div>
      ${this.modal}
    `;
  }

  private handleCancelClick(id: number) {
    this.modal.show(id);
  }

  private createCancelButton(orderId: number) {
    return new Button({
      name: '취소',
      variant: 'text',
      color: 'danger',
      size: 'small',
      onClick: this.handleCancelClick.bind(this, orderId),
    });
  }

  @on(OrderCancelConfirmEvent)
  private async handleOrderCancelConfirm(e: OrderCancelConfirmEvent) {
    const { id } = e.detail;
    await paymentRepository.cancel(id);
    window.location.reload();
  }
}

export const OrderRoute = {
  '/orders': OrderPage,
};

export const orderRenderHandler: RenderHandlerType<typeof OrderPage> = (createCurrentPage) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, res) => {
    (async () => {
      const layoutData = {
        ...res.locals.layoutData,
      };
      const { items, cursor } = await orderRepository.findMany({}, req.headers.cookie);
      res.send(
        new MetaView(
          createCurrentPage({ items, cursor, categories: req.categories, user: req.user, role: 'user' }),
          layoutData,
        ).toHtml(),
      );
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

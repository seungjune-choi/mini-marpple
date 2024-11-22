import { CustomEventWithDetail, html } from 'rune-ts';
import { Modal } from '../../components';
import { Button } from '../../components/button';

export class OrderCancelConfirmEvent extends CustomEventWithDetail<{ id: number }> {}

export class OrderCancelModal extends Modal {
  private id = 0;

  constructor() {
    super({
      title: '주문 취소',
      contents: [
        html` <div class="container horizontal" style="height:50px;">
          <p>정말 주문을 취소하시겠습니까?</p>
        </div>`,
        html`
          <div>
            ${new Button({ name: '취소', color: 'none', onClick: () => this.close() })}
            ${new Button({ name: '확인', color: 'danger', onClick: () => this.handleConfirmClick() })}
          </div>
        `,
      ],
    });
  }

  public show(id: number) {
    this.id = id;
    this.open();
  }

  private handleConfirmClick() {
    this.dispatchEvent(OrderCancelConfirmEvent, { bubbles: true, detail: { id: this.id } });
    this.close();
  }
}

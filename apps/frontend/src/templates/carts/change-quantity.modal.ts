import { html, on, View } from 'rune-ts';
import type { CartItem } from '../../model';
import { CloseModal, Modal } from '../../components';
import { ChangeQuantityForm } from './change-quantity.form';

export interface ChangeQuantityModalProps {
  item?: CartItem;
}

export class ChangeQuantityModal extends View<ChangeQuantityModalProps> {
  private readonly modal = new Modal({
    title: '수량 변경',
    contents: this.data.item && [new ChangeQuantityForm({ item: this.data.item })],
  });

  override template() {
    return html`<div>${this.modal}</div>`;
  }

  public open = () => this.modal.open();

  @on(CloseModal)
  private handleCloseModal() {
    this.modal.close();
  }

  setItem(item: CartItem) {
    this.modal.setContents([new ChangeQuantityForm({ item })]);
    this.redraw();
  }
}

import { html } from 'rune-ts';
import { Box, CloseModal, Modal } from '../../components';
import { SignInForm } from './sign-in.form';
import { UserRepository } from '../../repositories/users/user.repository.impl';

export class SignInModal extends Box {
  private repository = new UserRepository();
  private readonly modal = new Modal({ title: '로그인', contents: [new SignInForm(this.repository)] });

  override template() {
    return html`<div>${this.modal}</div>`;
  }

  public open = () => this.modal.open();

  protected override onRender(): void {
    this.addEventListener(CloseModal, () => this.modal.close());
  }
}

import { ModalClosedEvent, Modal } from '../../components';
import { SignInForm } from './sign-in.form';
import { userRepository } from '../../repositories/users';
import { on } from 'rune-ts';

export class SignInModal extends Modal {
  constructor() {
    super({ title: 'Sign In', contents: [new SignInForm(userRepository)] });
  }

  @on(ModalClosedEvent)
  private handleClose() {
    this.close();
  }
}

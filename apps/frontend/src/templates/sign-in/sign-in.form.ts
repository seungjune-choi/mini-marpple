import { html } from 'rune-ts';
import { Box, CloseModal } from '../../components';
import { Input } from '../../components/input';
import { z } from 'zod';
import style from './sign-in.module.scss';
import type { IUserRepository } from '../../repositories/users';
import { Button } from '../../components/button';

export class SignInForm extends Box {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  private readonly emailInput = new Input({
    name: 'email',
    type: 'email',
    label: '이메일',
    placeholder: '이메일을 입력하세요',
    validate: (value) => z.string().email().safeParse(value).success,
  });

  private readonly passwordInput = new Input({
    name: 'password',
    type: 'password',
    label: '비밀번호',
    placeholder: '비밀번호를 입력해주세요',
    validate: (value) => z.string().min(2).safeParse(value).success,
  });

  override template() {
    return html`
      <div class="${style['form-container']}">
        ${this.emailInput} ${this.passwordInput}
        ${new Button({ id: 'sign-in', name: '로그인', variant: 'outlined', onClick: this.handleClick.bind(this) })}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async handleClick() {
    if (!this.emailInput.isValid || !this.emailInput.isValid) {
      this.clearInput();
      return;
    }

    const res = await this.userRepository.signIn({
      email: this.emailInput.value,
      password: this.passwordInput.value,
    });

    if (res.statusCode === 200) {
      this.dispatchEvent(CloseModal, { bubbles: true });
      console.log(res);
    }

    this.clearInput();
  }

  private clearInput() {
    this.emailInput.clear();
    this.passwordInput.clear();
  }
}

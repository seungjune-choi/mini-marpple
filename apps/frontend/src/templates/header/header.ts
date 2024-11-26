import { CustomEventWithoutDetail, html, on, View } from 'rune-ts';
import style from './header.module.scss';
import { SignInModal } from '../sign-in';
import type { TargetUser } from '../../model';
import { userRepository } from '../../repositories/users';

export class SignInButtonClicked extends CustomEventWithoutDetail {}

export interface HeaderProps {
  user: TargetUser | null;
}

export class Header extends View<HeaderProps> {
  private modal = new SignInModal();

  override template() {
    return html`
      <div>
        <header class="${style.header}">
          <div class="${style.logo}">
            <a href="/">MiNi MARPPLE</a>
          </div>
          <div class="${style.actions}">${this.renderActions()}</div>
        </header>
        ${this.modal}
      </div>
    `;
  }

  private renderActions() {
    const signed = !!this.data.user;
    const isAdmin = !!this.data.user?.isAdmin;

    if (!signed) {
      return html`<button id="auth"><i class="fas fa-user"></i></button>`;
    }

    if (isAdmin) {
      return html`<button id="sign-out"><i class="fas fa-sign-out"></i></button>`;
    }

    return html`
      <button id="cart" data-location="/carts" class="location">
        <i class="fas fa-shopping-cart"></i>
      </button>
      <button id="order" data-location="/orders" class="location">
        <i class="fas fa-receipt"></i>
      </button>
      <button id="sign-out"><i class="fas fa-sign-out"></i></button>
    `;
  }

  @on('click', '#sign-out')
  private async onSignOutClick() {
    await userRepository.signOut();
    window.location.href = '/';
  }

  @on('click', '#auth')
  private onAuthClick() {
    this.modal.open();
  }

  @on('click', '.location')
  private onButtonClick(e: MouseEvent) {
    const button = e.currentTarget as HTMLElement;
    const location = button.dataset.location;
    if (location) {
      window.location.href = location;
    } else {
      alert('Not implemented yet');
    }
  }

  rerender(props: HeaderProps) {
    this.data.user = props.user;
    this.redraw();
  }
}

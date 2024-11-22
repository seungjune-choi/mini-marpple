import { CustomEventWithoutDetail, html, on, View } from 'rune-ts';
import style from './header.module.scss';
import { SignInModal } from '../sign-in';

export class SignInButtonClicked extends CustomEventWithoutDetail {}

export interface HeaderProps {
  isSigned: boolean;
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
          <div class="${style.buttons}">
            <button id="cart" data-location="/carts" class="location ${style.button}">
              <i class="fas fa-shopping-cart"></i>
            </button>
            ${!this.data.isSigned
              ? html`<button id="auth" class="${style.button}"><i class="fas fa-user"></i></button>`
              : html`<button id="order" data-location="/orders" class="location ${style.button}">
                  <i class="fas fa-receipt"></i>
                </button>`}
          </div>
        </header>
        ${this.modal}
      </div>
    `;
  }

  @on('click', '#auth')
  private onAuthClick() {
    this.modal.open();
  }

  @on('click', '.location')
  private onButtonClick(e: MouseEvent) {
    const button = e.target as HTMLElement;
    const location = button.dataset.location;
    if (location) {
      window.location.href = location;
    } else {
      alert('Not implemented yet');
    }
  }
}

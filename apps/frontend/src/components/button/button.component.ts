import { html, on, View } from 'rune-ts';
import style from './button.module.scss';

export interface ButtonProps {
  id?: string;
  type?: 'button' | 'submit';
  name: string;
  /**
   * @default: contained
   */
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'default' | 'none' | 'danger';
  onClick?: (e: Event) => Promise<void> | void;
}

export class Button<T extends ButtonProps = ButtonProps> extends View<T> {
  override template() {
    return html`
      <button
        id="${this.data.id ?? ''}"
        class="${style.button} ${style[this.data.color ?? 'primary']} ${style[this.data.variant ?? 'outlined']} ${style[
          this.data.size ?? 'medium'
        ]} "
        type="${this.data.type ?? 'button'}"
      >
        ${this.data.name}
      </button>
    `;
  }

  @on('click')
  private async handleClick(e) {
    this.data.onClick && (await this.data.onClick(e));
  }
}

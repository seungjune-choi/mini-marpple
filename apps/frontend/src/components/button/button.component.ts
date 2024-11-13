import { html, View } from 'rune-ts';
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
  color?: 'primary' | 'secondary' | 'default' | 'disabled';
}

export class Button extends View<ButtonProps> {
  override template() {
    return html`
      <button
        id="${this.data.id}"
        class="${style.button} ${style[this.data.variant ?? 'outlined']} ${style[this.data.size ?? 'medium']} ${style[
          this.data.color ?? 'primary'
        ]}"
        type="${this.data.type ?? 'button'}"
      >
        ${this.data.name}
      </button>
    `;
  }
}

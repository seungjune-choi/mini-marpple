import { html, View } from 'rune-ts';
import style from './text-field.module.scss';

export interface TextFieldProps {
  label?: string;
  password?: boolean;
  value?: string;
}

export class TextField extends View<TextFieldProps> {
  override template() {
    return html`
      <div class="${style['text-field-container']}">
        <input class="${style['text-field-input']}" type="${this.data.password ? 'password' : 'text'}" placeholder="" />
        <label class="${style['text-field-label']}">${this.data.label ?? ''}</label>
      </div>
    `;
  }

  protected override onRender() {
    const input = this.element().querySelector('input')!;
    input.addEventListener('input', () => (this.data.value = input.value));
  }
}

import { html, on, View } from 'rune-ts';
import style from './input.module.scss';

export type InputType = 'text' | 'password' | 'email' | 'number';

export interface InputProps<T = InputType> {
  /**
   * @default 'text'
   */
  type?: T;
  name: string;
  label?: string;
  /**
   * @default ''
   */
  value?: T extends 'number' ? number : string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  min?: T extends 'number' ? number : never;
  max?: T extends 'number' ? number : never;
  validate?: (value: string) => boolean;
  errorMessages?: string;
}

export class Input extends View<InputProps> {
  public get value() {
    const input = this.element().querySelector('input')! as HTMLInputElement;
    return input.value;
  }

  public set value(value: string) {
    const input = this.element().querySelector('input')! as HTMLInputElement;
    input.value = value;
  }

  override template() {
    return html`
      <div class="${style['input-container']}">
        <label class="${style['input-label']}" for="${this.data.name}">${this.data.label}</label>
        <input
          class="${style['input-field']}"
          id="${this.data.name}"
          name="${this.data.name}"
          type="text"
          title="test"
          value="${this.data.value ?? ''}"
          ${this.data.maxLength ? `maxlength="${this.data.maxLength}"` : ''}
          ${this.data.minLength ? `minlength="${this.data.minLength}"` : ''}
          ${this.data.required ? 'required' : ''}
          ${this.data.min ? `min="${this.data.min}"` : ''}
          ${this.data.max ? `max="${this.data.max}"` : ''}
        />
        <p id="${this.data.name}-error-message" class="${style['error-message']}"></p>
      </div>
    `;
  }

  @on('change', `.${style['input-field']}`)
  _handelChange(e) {
    if (this.data.validate) {
      const input = e.target as HTMLInputElement;
      const errorMessage = this.element().querySelector(`#${this.data.name}-error-message`)! as HTMLParagraphElement;
      const isValid = this.data.validate(input.value);
      errorMessage.textContent = isValid ? '' : this.data.errorMessages ?? '유효하지 않은 값입니다.';
      input.classList.toggle(style['input-error'], !isValid);
    }
  }

  @on('focusout', `.${style['input-field']}`)
  _handleFocus(e) {
    console.log(e.target);
  }

  // protected override onRender() {
  //   this.element()
  //     .querySelector('input')!
  //     .addEventListener('focus', (e) => console.log(e));
  // }
}

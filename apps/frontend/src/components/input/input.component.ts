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
  placeholder?: string;
  /**
   * @default ''
   */
  value?: T extends 'number' ? number : string;

  validate?: (value: string) => boolean;
  errorMessages?: string;
}

export class Input extends View<InputProps> {
  override template() {
    return html`
      <div class="${style['input-container']}">
        <label class="${style['input-label']}" for="${this.data.name}">${this.data.label}</label>
        <input
          class="${style['input-field']}"
          id="${this.data.name}"
          name="${this.data.name}"
          type="${this.data.type}"
          title="test"
          value="${this.data.value ?? ''}"
          placeholder="${this.data.placeholder ?? ''}"
        />
        <p id="${this.data.name}-error-message" class="${style['error-message']}"></p>
      </div>
    `;
  }

  @on('focusout', `.${style['input-field']}`)
  private handelChange(e) {
    if (e.target.value && this.data.validate) {
      const input = e.target as HTMLInputElement;
      const errorMessage = this.element().querySelector(`#${this.data.name}-error-message`)! as HTMLParagraphElement;
      const isValid = this.data.validate(input.value);
      errorMessage.innerHTML = isValid ? '' : this.data.errorMessages ?? '유효하지 않은 값입니다.';
      input.classList.toggle(style['input-error'], !isValid);
    }
  }

  @on('focusin', `.${style['input-field']}`)
  private handleFocus(e) {
    const input = e.target as HTMLInputElement;
    input.classList.remove(style['input-error']);
    const errorMessage = this.element().querySelector(`#${this.data.name}-error-message`)! as HTMLParagraphElement;
    errorMessage.textContent = '';
  }

  public get isValid() {
    return this.value && this.data.validate ? this.data.validate(this.value) : true;
  }

  public get value() {
    const input = this.element().querySelector('input')! as HTMLInputElement;
    return input.value;
  }

  public set value(value: string) {
    const input = this.element().querySelector('input')! as HTMLInputElement;
    input.value = value;
  }

  public clear() {
    const input = this.element().querySelector('input')! as HTMLInputElement;
    const errorParagraph = this.element().querySelector('p')!;
    input.value = '';
    errorParagraph.textContent = '';
    input.classList.remove(style['input-error']);
  }
}

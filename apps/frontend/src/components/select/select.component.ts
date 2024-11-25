import { html, on, View } from 'rune-ts';
import style from './select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  errorMessages?: string;
}

export class Select extends View<SelectProps> {
  override template() {
    return html`
      <div class="${style['select-container']}">
        <label class="${style['select-label']}" for="${this.data.name}">${this.data.label}</label>
        <select class="${style['select-field']}" id="${this.data.name}" name="${this.data.name}">
          ${this.data.placeholder ? html`<option value="" disabled selected>${this.data.placeholder}</option>` : ''}
          ${this.data.options.map(
            (option) =>
              html`<option value="${option.value}" ${this.data.value === option.value ? 'selected' : ''}>
                ${option.label}
              </option>`,
          )}
          <p id="${this.data.name}-error-message" class="${style['error-message']}"></p>
        </select>
      </div>
    `;
  }

  @on('focusout', `.${style['select-field']}`)
  private handelChange(e) {
    if (this.data.required && !this.value) {
      const select = e.target as HTMLSelectElement;
      const errorMessage = this.element().querySelector(`#${this.data.name}-error-message`)! as HTMLParagraphElement;
      errorMessage.innerHTML = '필수 항목입니다.';
      select.classList.add(style['input-error']);
    }
  }

  @on('focusin', `.${style['select-field']}`)
  private handleFocus(e) {
    const select = e.target as HTMLSelectElement;
    select.classList.remove(style['input-error']);
    const errorMessage = this.element().querySelector(`#${this.data.name}-error-message`)! as HTMLParagraphElement;
    errorMessage.textContent = '';
  }

  public get value() {
    const select = this.element().querySelector('select')! as HTMLSelectElement;
    return select.value;
  }

  public set value(value: string) {
    const select = this.element().querySelector('select')! as HTMLSelectElement;
    select.value = value;
  }

  public add(option: SelectOption) {
    const select = this.element().querySelector('select')! as HTMLSelectElement;
    const newOption = document.createElement('option');
    newOption.value = option.value;
    newOption.text = option.label;
    select.add(newOption);
  }
}

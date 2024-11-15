import { html, on, View } from 'rune-ts';
import { type ButtonProps } from './button.component';
import style from './button.module.scss';

export interface FileButtonProps extends ButtonProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export class FileButton extends View<FileButtonProps> {
  override template() {
    return html`
      <div>
        <button
          id="${this.data.id}"
          class="${style.button} ${style[this.data.variant ?? 'outlined']} ${style[this.data.size ?? 'medium']} ${style[
            this.data.color ?? 'primary'
          ]}"
          type="${this.data.type ?? 'button'}"
        >
          ${this.data.name}
        </button>
        <input
          id="${this.data.id}"
          type="file"
          accept="${this.data.accept ?? '*/*'}"
          multiple="${this.data.multiple ?? false}"
          style="display: none;"
        />
      </div>
    `;
  }

  @on('click', `.${style.button}`)
  private _handleChange() {
    const input = this.element().querySelector('input')!;
    input.click();
  }
}

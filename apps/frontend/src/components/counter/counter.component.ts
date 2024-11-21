import { CustomEventWithDetail, html, on, View, type Html } from 'rune-ts';
import style from './counter.module.scss';
import { z } from 'zod';

interface CounterProps {
  value: number;
}

export class CountChangedEvent extends CustomEventWithDetail<{ value: number }> {}

const numberSchema = z.string().regex(/^\d+$/, {
  message: '숫자만 입력 가능합니다.',
});

export class Counter extends View<CounterProps> {
  protected override template(data: CounterProps): Html {
    return html`
      <div class="${style.counter}">
        <button id="minus" class="${style.button}">-</button>
        <span class="${style.value}" contenteditable="true">${data.value}</span>
        <button id="plus" class="${style.button}">+</button>
      </div>
    `;
  }

  get value(): number {
    return Number(this.element().querySelector(`.${style.value}`)!.textContent);
  }

  @on('click', '#minus')
  private handleMinusClick() {
    this.updateValue(this.value - 1);
  }

  @on('click', '#plus')
  private handlePlusClick() {
    this.updateValue(this.value + 1);
  }

  @on('input', `.${style.value}`)
  private handleInput(e) {
    const value = e.target.textContent;
    if (!numberSchema.safeParse(value).success) {
      e.target.textContent = value.replace(/\D/g, '');
    }
  }

  @on('keydown')
  private preventEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  private updateValue(value: number) {
    this.element().querySelector(`.${style.value}`)!.textContent = String(value);
    this.dispatchEvent(CountChangedEvent, { bubbles: true, detail: { value } });
  }
}

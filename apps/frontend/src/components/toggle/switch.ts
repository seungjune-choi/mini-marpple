import { html } from 'rune-ts';
import { ToggleView } from './toggle-view';
import style from './switch.module.scss';

export class SwitchView extends ToggleView {
  constructor(private props: { on?: boolean }) {
    super({ on: props.on ?? false, onClass: style.on });
  }

  override template() {
    return html`
      <button class="${style.btn} ${this.data.on ? style.on : ''}">
        <span class="${style.toggle}"></span>
      </button>
    `;
  }

  get value() {
    return this.data.on;
  }
}

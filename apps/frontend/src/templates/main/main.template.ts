import { html, View } from 'rune-ts';
import { Modal } from '../../components';

export class MainTemplate extends View<object> {
  private _modal = new Modal({
    // title: 'Modal Test',
    contents: [html`<p>Modal Content</p>`],
  });
  override template() {
    return html`
      <div>
        ${this._modal}
        <button id="open">open</button>
      </div>
    `;
  }

  protected override onRender() {
    this.element()
      .querySelector('#open')!
      .addEventListener('click', () => this._modal.open());
  }
}
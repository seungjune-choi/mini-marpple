import style from './modal.module.scss';
import { Box } from '../box';
import { CustomEventWithoutDetail, html, View } from 'rune-ts';

interface ModalProps {
  title?: string;
  contents?: View[];
}

export class CloseModal extends CustomEventWithoutDetail {}

export class Modal extends Box {
  constructor(private readonly props: ModalProps) {
    super();
  }

  override template() {
    return html`
      <div class="${style.modal}">
        <div class="${style['modal-content']}">
          <span class="${style['modal-close']}">&times;</span>
          <h2>${this.props?.title ?? ''}</h2>
          ${this.props?.contents}
        </div>
      </div>
    `;
  }

  public open = () => this.element().classList.add(style.open);

  public close = () => this.element().classList.remove(style.open);

  public setContents(contents: View[]) {
    this.props.contents = contents;
  }

  protected override onRender() {
    this.element()
      .querySelector(`.${style['modal-close']}`)!
      .addEventListener('click', () => this.close());

    this.element().addEventListener('click', (e) => {
      if (e.target === this.element()) {
        this.close();
      }
    });
  }
}

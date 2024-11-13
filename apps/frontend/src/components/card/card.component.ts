import { type Html, html, View } from 'rune-ts';
import style from './card.module.scss';

export interface CardProps {
  header?: Html;
  body?: Html;
  footer?: Html;
}
export class Card extends View<CardProps> {
  override template() {
    return html`
      <div class="${style.card}">
        ${this.data.header ? html`<div class="${style.card_header}">${this.data.header}</div>` : ''}
        ${this.data.body ? html`<div class="${style.card_body}">${this.data.body}</div>` : ''}
        ${this.data.footer ? html`<div class="${style.card_footer}">${this.data.footer}</div>` : ''}
      </div>
    `;
  }
}

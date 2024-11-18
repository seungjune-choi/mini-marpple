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
        ${this.data.body ? html`<div class="${style['card-content']}">${this.data.body}</div>` : ''}
        ${this.data.footer ? html`<div class="${style['card-footer']}">${this.data.footer}</div>` : ''}
      </div>
    `;
  }
}

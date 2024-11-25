import { html, View, type Html } from 'rune-ts';
import type { BindModel } from '../../experimental';
import type { Product } from '../../model';
import { Card } from '../../components/card';
import style from './product-list.module.scss';

export interface BaseProductCardProps {
  model: BindModel<Partial<Product>>;
}

export class BaseProductCard extends View<BaseProductCardProps> {
  protected override template(): Html {
    return html`<div>${this.baseTemplate()}</div>`;
  }

  protected baseTemplate(): Html {
    return html` ${new Card({
      body: html`
        <div class="${style['product-brief-card-body']}">
          ${this.data.model.value?.images?.at(0)
            ? html`<img alt="${this.data.model.value.name}" src="${this.data.model.value?.images?.at(0)?.src}" />`
            : html`<img src="https://via.placeholder.com/300" alt="placeholder" />`}
        </div>
      `,
      footer: html`<div class="${style['product-brief-card-footer']}">
        <div id="name" class="${style.name}">${this.data.model.value?.name ?? ''}</div>
        <div id="description" class="${style.description}">${this.data.model.value?.description ?? ''}</div>
        <div id="price" class="${style.price}">${this.data.model.value?.price ?? ''} 원</div>
      </div> `,
    })}`;
  }
}

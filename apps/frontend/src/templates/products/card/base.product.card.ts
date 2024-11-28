import { CustomEventWithDetail, html, on, View, type Html } from 'rune-ts';
import type { BindModel } from '../../../experimental';
import type { Product } from '../../../model';
import { Card } from '../../../components/card';
import { readFile } from '../../../utils';
import style from './product.card.module.scss';

export class ProductCardClickedEvent extends CustomEventWithDetail<{ productId: number }> {}

export class AddCartEvent extends CustomEventWithDetail<{ productId: number }> {}

export interface BaseProductCardProps {
  model: BindModel<Partial<Product>>;
  /** Q. 더 좋은 방법 없을지??, view 재활용을 해야하는데 조금씩 다를때..?  */
  enableCartButton?: boolean;
}

export class BaseProductCard<T extends BaseProductCardProps = BaseProductCardProps> extends View<T> {
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
        ${this.data.enableCartButton
          ? html`<div class="${style['cart-button']}"><i class="fas fa-shopping-cart"></i></div>`
          : ''}
        <div id="name" class="${style.name}">${this.data.model.value?.name ?? ''}</div>
        <div id="description" class="${style.description}">${this.data.model.value?.description ?? ''}</div>
        <div id="price" class="${style.price}">${this.data.model.value?.price?.toLocaleString('ko-KR') ?? ''} 원</div>
      </div> `,
    })}`;
  }

  @on('click', `.${style['cart-button']}`)
  private handleAddCart(e) {
    if (!this.data.enableCartButton) return;
    // Q. 이벤트 전파를 막는 방법?
    e.o;
    this.dispatchEvent(AddCartEvent, { bubbles: false, detail: { productId: this.data.model.value.id! } });
  }

  @on('click')
  private handleClick(e: Event) {
    if (e.target === this.element().querySelector(`.${style['cart-button']}`)) return;
    this.dispatchEvent(ProductCardClickedEvent, {
      bubbles: true,
      detail: { productId: this.data.model.value.id! },
    });
  }

  protected override onRender(): void {
    this.data.model.bind('name', (v) => (this.element().querySelector('#name')!.innerHTML = v ?? ''));
    this.data.model.bind('description', (v) => (this.element().querySelector('#description')!.innerHTML = v ?? ''));
    this.data.model.bind(
      'price',
      (v) => (this.element().querySelector('#price')!.innerHTML = v?.toLocaleString('ko-KR') ?? ''),
    );
    this.data.model.bind('images', async (v) => {
      if (!v) return;
      const representativeImage = v.find((img) => img.isRepresentative) ?? v.at(0);
      const imageSrc =
        typeof representativeImage?.src === 'string'
          ? representativeImage.src
          : await readFile(representativeImage!.src);
      this.element().querySelector('img')!.src = imageSrc as string;
    });
    // this.delegate('click', `.${style['cart-button']}`, (e) => {
    //   e.preventDefault();
    // });
  }
}

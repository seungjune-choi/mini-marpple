import { html, View, type Html } from 'rune-ts';
import type { BindModel } from '../../experimental';
import type { Product } from '../../model';
import style from './product-list.module.scss';
import { Card } from '../../components/card';
import { readFile } from '../../utils';

export interface ProductCardProps {
  model: BindModel<Partial<Product>>;
}

export class ProductCard extends View<ProductCardProps> {
  protected override template(): Html {
    return html`
      <div style="width: 300px">
        ${new Card({
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
        })}
      </div>
    `;
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

      console.log('ProductCart', imageSrc);
      this.element().querySelector('img')!.src = imageSrc as string;
    });
  }
}

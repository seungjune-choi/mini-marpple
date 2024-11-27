import { html, on, View, type Html } from 'rune-ts';
import { Modal, ModalClosedEvent } from '../../components';
import type { BindModel } from '../../experimental';
import type { Product } from '../../model';
import { Carousel } from '../../components/carousel';
import { map, pipe, toArray } from '@fxts/core';
import style from './product-detail.module.scss';

export interface ProductDetailProps {
  model?: BindModel<Product>;
}
export class ProductDetailBody extends View<Required<ProductDetailProps>> {
  protected override template(): Html {
    return html`
      <div class="container vertical ${style['product-body']}">
        ${new Carousel({
          children: pipe(
            this.data.model.value.images,
            map((image) => html`<img src="${image.src}" style="width: 100%; height: 100%; object-fit:contain;" />`),
            toArray,
          ),
          autoPlay: true,
          interval: 1000,
        })}
        <div class="${style.metadata}">
          <div class="${style.name}">${this.data.model.value.name}</div>
          <div class="${style.description}">${this.data.model.value.description}</div>
          <div class="form-control horizontal" style="justify-content:flex-start">
            <div class="${style.price}">${this.data.model.value.price.toLocaleString('ko-KR')} 원</div>
            <div class="${style.stock}">
              남은 수량 (${this.data.model.value.stockQuantity.toLocaleString('ko-KR')} 개)
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export class ProductDetailModal extends Modal {
  constructor(private prop: ProductDetailProps) {
    super({
      title: '상품 정보',
      contents: [
        prop.model
          ? new ProductDetailBody({
              model: prop.model,
            })
          : html`<div>상품 정보가 없습니다.</div>`,
      ],
    });
  }

  @on(ModalClosedEvent)
  private handleClose() {
    this.close();
  }

  setProduct(model: BindModel<Product>) {
    this.prop.model = model;
    this.setContents([
      new ProductDetailBody({
        model,
      }),
    ]);
    this.redraw();
  }
}

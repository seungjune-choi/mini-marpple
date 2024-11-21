import { html, View } from 'rune-ts';
import { Input } from '../../components/input';
import { Select } from '../../components/select/select.component';
import type { Product } from '../../model';
import { SwitchView } from '../../components/toggle';
import { filter, map, pipe, reduce } from '@fxts/core';
import { z } from 'zod';

export interface ProductMetadataTemplateProps {
  categories: { id: number; name: string }[];
  product?: Omit<Product, 'images'>;
}

export class ProductMetadataEditor extends View<ProductMetadataTemplateProps> {
  private elements = {
    name: new Input({
      name: 'name',
      label: '상품명',
      value: this.data.product?.name,
      required: true,
      validate: (v) => z.string().min(2).max(100).safeParse(v).success,
      errorMessages: `2자 이상 100자 이하만 \r\n입력 가능합니다.`,
    }),
    description: new Input({
      name: 'description',
      label: '상품 설명',
      value: this.data.product?.description,
      required: true,
      validate: (v) => z.string().min(2).max(1000).safeParse(v).success,
    }),
    price: new Input({
      name: 'price',
      label: '가격',
      type: 'number',
      value: this.data.product?.price.toString(),
      validate: (v) => z.number().min(1000).max(1000000).safeParse(+v).success,
      errorMessages: '1000원 이상 100만원 이하만 입력 가능합니다.',
    }),
    stockQuantity: new Input({
      name: 'stockQuantity',
      label: '재고 수량',
      type: 'number',
      value: this.data.product?.stockQuantity.toString(),
      validate: (v) => z.number().min(0).max(1000).safeParse(+v).success,
    }),
    hidden: new SwitchView({ on: this.data.product?.hidden ?? false }),
  };

  private categorySelect = new Select({
    name: 'category',
    label: '카테고리',
    options: this.data.categories.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })),
  });

  protected override template() {
    return html`
      <div class="form-group vertical">
        <div class="form-control horizontal between">
          <div class="form-control" style="width:50%">${this.categorySelect}</div>
          <div class="form-control horizontal"><label>숨김처리</label>${this.elements.hidden}</div>
        </div>
        <div class="form-control horizontal">
          <div class="form-control" style="width:50%">${this.elements.name}</div>
          <div class="form-control" style="width:50%">${this.elements.price}</div>
        </div>
        <div class="form-control horizontal">
          <div class="form-control" style="width:50%">${this.elements.description}</div>
          <div class="form-control" style="width:50%">${this.elements.stockQuantity}</div>
        </div>
      </div>
    `;
  }

  validate = () =>
    pipe(
      Object.values(this.elements),
      filter((element) => element instanceof Input),
      map((i) => i.isValid),
      reduce((acc, cur) => acc && cur),
    );

  get value() {
    return {
      categoryId: Number(this.categorySelect.value),
      name: this.elements.name.value,
      description: this.elements.description.value,
      price: Number(this.elements.price.value),
      stockQuantity: Number(this.elements.stockQuantity.value),
      hidden: this.elements.hidden.value,
    };
  }
}

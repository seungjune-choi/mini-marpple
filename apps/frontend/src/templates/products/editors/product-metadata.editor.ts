import { html, on, View } from 'rune-ts';
import { Input } from '../../../components/input';
import { Select } from '../../../components/select/select.component';
import { SwitchView } from '../../../components/toggle';
import type { ProductBindModel } from '../../../experimental/product.bind.model';
import type { Product } from '../../../model';
import { ProductPreviewCard } from '../card';

export interface ProductMetadataTemplateProps {
  categories: { id: number; name: string }[];
  model: ProductBindModel;
}

export class ProductMetadataEditor extends View<ProductMetadataTemplateProps> {
  private inputs = {
    name: new Input({
      name: 'name',
      label: '상품명',
      value: this.data.model.value.name,
      validate: () => this.data.model.validate('name').success,
      errorMessages: `2자 이상 100자 이하만 입력 가능합니다.`,
    }),
    description: new Input({
      name: 'description',
      label: '상품 설명',
      value: this.data.model.value.description,
      validate: () => this.data.model.validate('description').success,
      errorMessages: '2자 이상 1000자 이하만 입력 가능합니다.',
    }),
    price: new Input({
      name: 'price',
      label: '가격',
      type: 'number',
      value: this.data.model.value.price?.toString(),
      validate: () => this.data.model.validate('price').success,
      errorMessages: '1000원 이상 100만원 이하만 입력 가능합니다.',
    }),
    stockQuantity: new Input({
      name: 'stockQuantity',
      label: '재고 수량',
      type: 'number',
      value: this.data.model.value.stockQuantity?.toString(),
      validate: () => this.data.model.validate('stockQuantity').success,
      errorMessages: '0 이상 1000 이하만 입력 가능합니다.',
    }),
    hidden: new SwitchView({ on: this.data.model?.value?.hidden ?? false }),
  };

  private categorySelect = new Select({
    name: 'category',
    label: '카테고리',
    placeholder: '선택해주세요',
    value: this.data.model.value.categoryId.toString(),
    required: true,
    options: this.data.categories.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })),
    errorMessages: '카테고리를 선택해주세요.',
  });

  protected override template() {
    return html`
      <div class="form-group vertical">
        <div class="form-control vertical">
          <strong>미리보기</strong>
          ${new ProductPreviewCard({ model: this.data.model })}
        </div>
        <div class="form-control horizontal">
          <div class="form-control" style="width:50%">${this.categorySelect}</div>
          <div class="form-control vertical" style="width:50%"><label>숨김처리</label>${this.inputs.hidden}</div>
        </div>
        <div class="form-control horizontal">
          <div class="form-control" style="width:50%">${this.inputs.name}</div>
          <div class="form-control" style="width:50%">${this.inputs.price}</div>
        </div>
        <div class="form-control horizontal">
          <div class="form-control" style="width:50%">${this.inputs.description}</div>
          <div class="form-control" style="width:50%">${this.inputs.stockQuantity}</div>
        </div>
      </div>
    `;
  }

  @on('input', 'input')
  private handleInput(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    this.data.model.update(target.name as keyof Product, target.type === 'number' ? +target.value : target.value);
  }

  @on('change', 'select')
  private handleSelect(e: InputEvent) {
    const target = e.target as HTMLSelectElement;
    this.data.model.update('categoryId', +target.value);
  }
}

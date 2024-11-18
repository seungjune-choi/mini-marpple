import { html, View } from 'rune-ts';
import { Input } from '../../components/input';
import { Select } from '../../components/select/select.component';
import { baseClient } from '../../web-client';
import { forEach, pipe } from '@fxts/core';

export class ProductMetadataTemplate extends View<object> {
  private nameInput = new Input({
    name: 'name',
  });

  private categorySelect = new Select({
    name: 'category',
    options: [],
  });

  protected override template() {
    return html`
      <div class="container vertical">
        <div
          style="
              width: 100%;
              height: 100%;
              background-color: #f1f1f1;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 auto;
              "
        >
          ${this.categorySelect}
        </div>
      </div>
    `;
  }

  protected override async onRender(): Promise<void> {
    const categories: any[] = await baseClient
      .get('/categories/v1')
      .then((res) => res.data)
      .then((data) => data.data);

    pipe(
      categories,
      forEach((category) => {
        this.categorySelect.add({
          label: category.name,
          value: category.id,
        });
      }),
    );
  }
}

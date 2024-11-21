import { html, on, View, type Html } from 'rune-ts';
import type { CursorBasedPaginationResponse, ProductBrief } from '../../model';
import style from './product-list.module.scss';
import { cartRepository } from '../../repositories/carts';
import { productRepository } from '../../repositories/products';
import { ProductCardList } from './product-cart-list';

export class ProductListTemplate extends View<CursorBasedPaginationResponse<ProductBrief>> {
  private list = new ProductCardList({ items: this.data.items });

  protected override template(): Html {
    return html`
      <div>
        ${this.list}
        <div id="sentinel"></div>
      </div>
    `;
  }

  @on('click', `.${style['cart-button']}`)
  async handleCartButtonClick(e) {
    await cartRepository.addItem(+e.currentTarget.dataset.id, 1);
  }

  protected override onRender(): void {
    const target = this.element().querySelector('#sentinel')!;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        const { cursor } = this.data;
        if (cursor) {
          const nextData = await productRepository.findAll({ cursor });
          this.data.items = [...this.data.items, ...nextData.items];
          this.data.cursor = nextData.cursor;
          await this.list.rerender(this.data.items);
        }
      }
    });

    observer.observe(target);
  }
}

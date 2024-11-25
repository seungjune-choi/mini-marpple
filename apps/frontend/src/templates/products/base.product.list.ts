import type { Product } from '../../model';
import { Box } from '../../components';
import { html, type View } from 'rune-ts';
import style from './product-list.module.scss';
import type { BindModel } from '../../experimental';

export interface BaseProductListProps {
  categoryId?: number;
  items: View<{ model: BindModel<Partial<Product>> }>[];
  cursor: number;
}

export abstract class BaseProductList extends Box {
  constructor(private props: BaseProductListProps) {
    super();
  }

  protected override template() {
    return html`
      <div>
        <div class="${style['product-list-container']}">${this.props.items.map((item) => item)}</div>
        <div id="sentinel"></div>
      </div>
    `;
  }

  protected override onRender(): void {
    const target = this.element().querySelector('#sentinel')!;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        const { cursor } = this.props;
        if (cursor) {
          const nextData = await this.next();
          this.props.items = [...this.props.items, ...nextData.items];
          this.props.cursor = nextData.cursor;
          this.redraw();
        }
      }
    });

    observer.observe(target);
  }

  abstract next(): Promise<{ items: View<{ model: BindModel<Partial<Product>> }>[]; cursor: number }>;
}

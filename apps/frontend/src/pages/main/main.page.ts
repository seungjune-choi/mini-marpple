import { html, on, View, type Html } from 'rune-ts';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { type LayoutData, MetaView } from '@rune-ts/server';
import { productRepository } from '../../repositories/products';
import type { ProductBrief } from '../../model';
import { BasePage, type BasePageProps } from '../base.page';
import { CursorPaginationContainer } from '../../components/pagination-container';
import { CustomerProductListView, ProductCardClickedEvent } from '../../templates/products';
import { ProductDetailModal } from '../../templates/products/product-detail.modal';
import { BindModel } from '../../experimental';

interface MainPageProps extends BasePageProps {
  items: ProductBrief[];
  cursor: number;
  categoryId?: number;
}

export class MainPage extends BasePage<MainPageProps> {
  private detailModal = new ProductDetailModal({});
  protected override content(): Html | View {
    return html`<div>
      ${new CursorPaginationContainer({
        cursor: this.data.cursor,
        listView: new CustomerProductListView({ items: this.data.items }),
        next: (args: { cursor: number }) =>
          productRepository.findAll({
            cursor: args.cursor,
            categoryId: this.data.categoryId,
          }),
      })}
      ${this.detailModal}
    </div> `;
  }

  @on(ProductCardClickedEvent)
  private async handleProductCardClicked(event: ProductCardClickedEvent) {
    const { productId } = event.detail;
    const target = await productRepository.findOne(productId);
    this.detailModal.setProduct(
      new BindModel({
        ...target,
        images: [
          {
            id: target.representativeImage?.id,
            src: target.representativeImage?.src,
            isRepresentative: true,
          },
          ...target.optionalImages.map((img) => ({
            id: img.id,
            src: img.src,
            isRepresentative: false,
          })),
        ],
      }),
    );
    this.detailModal.open();
  }
}

export const MainRoute = {
  '/': MainPage,
};

export const mainRenderHandler: RenderHandlerType<typeof MainPage> = (createCurrentPage) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, res) => {
    (async () => {
      const layoutData: LayoutData = {
        ...res.locals.layoutData,
      };

      const { items, cursor } = await productRepository.findAll({});

      res.send(
        new MetaView(
          createCurrentPage({ items, cursor, categories: req.categories, user: req.user, role: 'user' }),
          layoutData,
        ).toHtml(),
      );
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

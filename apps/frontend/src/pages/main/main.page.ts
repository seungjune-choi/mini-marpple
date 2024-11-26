import { View, type Html } from 'rune-ts';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { type LayoutData, MetaView } from '@rune-ts/server';
import { ProductListTemplate } from '../../templates/products';
import { productRepository } from '../../repositories/products';
import type { CursorBasedPaginationResponse, ProductBrief } from '../../model';
import { BasePage, type BasePageProps } from '../base.page';

interface MainPageData extends BasePageProps {
  products: CursorBasedPaginationResponse<ProductBrief>;
}

export class MainPage extends BasePage<MainPageData> {
  private productListTemplate = new ProductListTemplate(this.data.products);

  protected override content(): Html | View {
    return this.productListTemplate;
  }
}

export const MainRoute = {
  '/': MainPage,
};

export const mainRenderHandler: RenderHandlerType<typeof MainPage> = (createCurrentPage) => {
  return (req: any, res) => {
    (async () => {
      const layoutData: LayoutData = {
        ...res.locals.layoutData,
      };

      const products = await productRepository.findAll({});

      res.send(
        new MetaView(createCurrentPage({ products, categories: req.categories, user: req.user }), layoutData).toHtml(),
      );
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

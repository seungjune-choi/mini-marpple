import { html, Page } from 'rune-ts';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { type LayoutData, MetaView } from '@rune-ts/server';
import { Header, type HeaderProps } from '../../templates/header';
import { SideBar, type SideBarProps } from '../../templates/side-bar';
import { ProductListTemplate } from '../../templates/products';
import { productRepository } from '../../repositories/products';
import type { CursorBasedPaginationResponse, ProductBrief } from '../../model';

interface MainPageData extends HeaderProps, SideBarProps {
  products: CursorBasedPaginationResponse<ProductBrief>;
}

export class MainPage extends Page<MainPageData> {
  private header = new Header({ isSigned: this.data.isSigned });
  private sideBar = new SideBar({ categories: this.data.categories });
  private productListTemplate = new ProductListTemplate(this.data.products);

  override template() {
    return html` <div>
      ${this.header} ${this.sideBar}
      <div class="content">${this.productListTemplate}</div>
    </div>`;
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

      const categories = req.categories;
      const isSigned = req.isSigned;
      const products = await productRepository.findAll({});

      res.send(new MetaView(createCurrentPage({ products, isSigned, categories }), layoutData).toHtml());
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

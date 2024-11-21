import { html, Page } from 'rune-ts';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { type LayoutData, MetaView } from '@rune-ts/server';
import { Header } from '../../templates/header';
import { SideBar } from '../../templates/side-bar';
import { ProductListTemplate } from '../../templates/products';
import { productRepository } from '../../repositories/products';
import type { CursorBasedPaginationResponse, ProductBrief } from '../../model';

export class MainPage extends Page<CursorBasedPaginationResponse<ProductBrief>> {
  private header = new Header();
  private sideBar = new SideBar();
  private productListTemplate = new ProductListTemplate(this.data);

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
  return (req, res) => {
    (async () => {
      const layoutData: LayoutData = {
        ...res.locals.layoutData,
      };
      const productList = await productRepository.findAll({});
      res.send(new MetaView(createCurrentPage(productList), layoutData).toHtml());
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

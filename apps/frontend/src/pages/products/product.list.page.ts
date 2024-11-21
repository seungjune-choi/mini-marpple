import { Page, html } from 'rune-ts';
import type { CursorBasedPaginationResponse, ProductBrief } from '../../model';
import { Header, type HeaderProps } from '../../templates/header';
import { ProductListTemplate } from '../../templates/products';
import { SideBar, type SideBarProps } from '../../templates/side-bar';
import { productRepository } from '../../repositories/products';
import { MetaView } from '@rune-ts/server';

interface ProductListPageProps extends HeaderProps, SideBarProps {
  products: CursorBasedPaginationResponse<ProductBrief>;
}

export class ProductListPage extends Page<ProductListPageProps> {
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

export const ProductListRoute = {
  '/products': ProductListPage,
};

export const productListRenderHandler = (createCurrentPage) => {
  return (req, res) => {
    (async () => {
      const layoutData = {
        ...res.locals.layoutData,
      };
      const query = req.query;
      const categories = req.categories;
      const isSigned = req.isSigned;

      const products = await productRepository.findAll({
        categoryId: query.categoryId,
      });

      res.send(new MetaView(createCurrentPage({ products, isSigned, categories }), layoutData).toHtml());
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

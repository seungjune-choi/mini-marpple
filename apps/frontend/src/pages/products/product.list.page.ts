import { View } from 'rune-ts';
import type { ProductBrief } from '../../model';
import { productRepository } from '../../repositories/products';
import { MetaView } from '@rune-ts/server';
import { BasePage, type BasePageProps } from '../base.page';
import { CursorPaginationContainer } from '../../components/pagination-container';
import { CustomerProductListView } from '../../templates/products';

interface ProductListPageProps extends BasePageProps {
  items: ProductBrief[];
  cursor: number;
  categoryId?: number;
}

export class ProductListPage extends BasePage<ProductListPageProps> {
  protected override content(): View {
    return new CursorPaginationContainer({
      cursor: this.data.cursor,
      listView: new CustomerProductListView({ items: this.data.items }),
      next: (args: { cursor: number }) =>
        productRepository.findAll({
          cursor: args.cursor,
          categoryId: this.data.categoryId,
        }),
    });
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
      const user = req.user;
      const { items, cursor } = await productRepository.findAll({
        categoryId: query.categoryId,
      });

      res.send(new MetaView(createCurrentPage({ items, cursor, categories, user, role: 'user' }), layoutData).toHtml());
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

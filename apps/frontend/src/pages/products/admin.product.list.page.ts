import type { ProductBrief } from '../../model';
import { productRepository } from '../../repositories/products';
import { MetaView } from '@rune-ts/server';
import { BasePage, type BasePageProps } from '../base.page';
import { AdminProductListView } from '../../templates/products/list-view/admin.product.list.view';
import { CursorPaginationContainer } from '../../components/pagination-container';
import type { View } from 'rune-ts';

export interface AdminProductListPageProps extends BasePageProps {
  items: ProductBrief[];
  cursor: number;
  categoryId?: number;
}

export class AdminProductListPage extends BasePage<AdminProductListPageProps> {
  override content(): View {
    return new CursorPaginationContainer({
      cursor: this.data.cursor,
      listView: new AdminProductListView({ items: this.data.items }),
      next: (args: { cursor: number }) =>
        productRepository.findAll({
          cursor: args.cursor,
          categoryId: this.data.categoryId,
        }),
    });
  }
}

export const AdminProductListRoute = {
  '/admin/products': AdminProductListPage,
};

export const adminProductListRenderHandler = (createCurrentPage) => {
  return (req, res) => {
    (async () => {
      const layoutData = {
        ...res.locals.layoutData,
      };
      const query = req.query;
      const products = await productRepository.findAll({
        categoryId: query.categoryId,
      });

      res.send(
        new MetaView(
          createCurrentPage({
            items: products.items,
            cursor: products.cursor,
            categories: req.categories,
            user: req.user,
            role: 'admin',
          }),
          layoutData,
        ).toHtml(),
      );
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

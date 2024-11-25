import { Page, html } from 'rune-ts';
import type { Product, ProductBrief, TargetUser } from '../../model';
import { Header, type HeaderProps } from '../../templates/header';
import { AdminProductList } from '../../templates/products';
import { SideBar, type SideBarProps } from '../../templates/side-bar';
import { productRepository } from '../../repositories/products';
import { MetaView } from '@rune-ts/server';
import { fx } from '@fxts/core';
import { BindModel } from '../../experimental';
import { AdminProductCard } from '../../templates/products/admin.product.card';

interface AdminProductListPageProps extends HeaderProps, SideBarProps {
  items: ProductBrief[];
  cursor: number;
  categoryId?: number;
}

export class AdminProductListPage extends Page<AdminProductListPageProps> {
  private header = new Header({ isSigned: this.data.isSigned });
  private sideBar = new SideBar({ categories: this.data.categories });
  private productListTemplate = new AdminProductList({
    items: fx(this.data.items)
      .map(
        (i) =>
          new AdminProductCard({
            model: new BindModel<Partial<Product>>({
              id: i.id,
              name: i.name,
              description: i.description,
              price: i.price,
              images: [
                {
                  id: i.representativeImage.id,
                  src: i.representativeImage.url,
                  isRepresentative: true,
                },
              ],
            }),
          }),
      )
      .toArray(),
    categoryId: this.data.categoryId,
    cursor: this.data.cursor,
  });

  override template() {
    return html` <div>
      ${this.header} ${this.sideBar}
      <div class="content">${this.productListTemplate}</div>
    </div>`;
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
      const categories = req.categories;
      const user: TargetUser | null = req.user;
      console.log('user', user);
      const products = await productRepository.findAll({
        categoryId: query.categoryId,
      });

      res.send(
        new MetaView(
          createCurrentPage({ items: products.items, cursor: products.cursor, isSigned: !!user, categories }),
          layoutData,
        ).toHtml(),
      );
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

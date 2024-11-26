import type { Product, ProductBrief } from '../../model';
import { AdminProductList } from '../../templates/products';
import { productRepository } from '../../repositories/products';
import { MetaView } from '@rune-ts/server';
import { fx } from '@fxts/core';
import { BindModel } from '../../experimental';
import { AdminProductCard } from '../../templates/products/admin.product.card';
import { BasePage, type BasePageProps } from '../base.page';

interface AdminProductListPageProps extends BasePageProps {
  items: ProductBrief[];
  cursor: number;
  categoryId?: number;
}

export class AdminProductListPage extends BasePage<AdminProductListPageProps> {
  private productListTemplate = new AdminProductList({
    items: fx(this.data.items).map(this.createCard.bind(this)).toArray(),
    categoryId: this.data.categoryId,
    cursor: this.data.cursor,
  });

  override content() {
    return this.productListTemplate;
  }

  private createCard(product: ProductBrief) {
    return new AdminProductCard({
      model: new BindModel<Partial<Product>>({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: [
          {
            id: product.representativeImage.id,
            src: product.representativeImage.url,
            isRepresentative: true,
          },
        ],
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

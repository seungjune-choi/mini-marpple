import { createRouter } from '@rune-ts/server';
import { MainRoute } from '../../pages/main';
import { CartRoute } from '../../pages/cart';
import { AdminProductListRoute, ProductEditRoute, ProductListRoute } from '../../pages/products';
import { OrderRoute } from '../../pages/orders';

type RouterType = typeof MainRoute &
  typeof CartRoute &
  typeof ProductEditRoute &
  typeof ProductListRoute &
  typeof AdminProductListRoute &
  typeof OrderRoute;

export const ClientRouter = createRouter<RouterType>({
  ...MainRoute,
  ...CartRoute,
  ...ProductEditRoute,
  ...ProductListRoute,
  ...AdminProductListRoute,
  ...OrderRoute,
});

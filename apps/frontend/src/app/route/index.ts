import { createRouter } from '@rune-ts/server';
import { MainRoute } from '../../pages/main';
import { SubRoute } from '../../pages/sub';
import { CartRoute } from '../../pages/cart';
import { ProductEditRoute, ProductListRoute } from '../../pages/products';
import { OrderRoute } from '../../pages/orders';

type RouterType = typeof MainRoute &
  typeof SubRoute &
  typeof CartRoute &
  typeof ProductEditRoute &
  typeof ProductListRoute &
  typeof OrderRoute;

export const ClientRouter = createRouter<RouterType>({
  ...MainRoute,
  ...SubRoute,
  ...CartRoute,
  ...ProductEditRoute,
  ...ProductListRoute,
  ...OrderRoute,
});

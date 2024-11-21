import { createRouter } from '@rune-ts/server';
import { MainRoute } from '../../pages/main';
import { SubRoute } from '../../pages/sub';
import { CartRoute } from '../../pages/cart';
import { ProductEditRoute } from '../../pages/products';

type RouterType = typeof MainRoute & typeof SubRoute & typeof CartRoute & typeof ProductEditRoute;

export const ClientRouter = createRouter<RouterType>({
  ...MainRoute,
  ...SubRoute,
  ...CartRoute,
  ...ProductEditRoute,
});

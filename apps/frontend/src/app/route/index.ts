import { createRouter } from '@rune-ts/server';
import { MainRoute } from '../../pages/main';
import { SubRoute } from '../../pages/sub';

type RouterType = typeof MainRoute & typeof SubRoute;

export const ClientRouter = createRouter<RouterType>({
  ...MainRoute,
  ...SubRoute,
});

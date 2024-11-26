/* eslint-disable @typescript-eslint/no-misused-promises */
import { app } from '@rune-ts/server';
import { ClientRouter } from '../route';
import { faviconInterceptor } from './middlewares/favicon.interceptor';
import { cartRenderHandler } from '../../pages/cart';
import {
  adminProductListRenderHandler,
  productEditRenderHandler,
  productListRenderHandler,
} from '../../pages/products';
import { categoryMiddleware } from './middlewares/category.middleware';
import { sessionMiddleware } from './middlewares/session.middleware';
import { orderRenderHandler } from '../../pages/orders';
import { mainRenderHandler } from '../../pages/main';
import { adminMiddleware } from './middlewares/admin.guard';
const server = app();

server.use(sessionMiddleware);
server.use(categoryMiddleware);
server.use(faviconInterceptor);
server.use('/admin', adminMiddleware);

server.get(ClientRouter['/'].toString(), await mainRenderHandler(ClientRouter['/']));
server.get(ClientRouter['/carts'].toString(), await cartRenderHandler(ClientRouter['/carts']));

server.get(ClientRouter['/products'].toString(), productListRenderHandler(ClientRouter['/products']));
server.get(ClientRouter['/orders'].toString(), orderRenderHandler(ClientRouter['/orders']));

// admin
server.get(ClientRouter['/admin/products'].toString(), adminProductListRenderHandler(ClientRouter['/admin/products']));
server.get(
  ClientRouter['/admin/product-edit'].toString(),
  await productEditRenderHandler(ClientRouter['/admin/product-edit']),
);

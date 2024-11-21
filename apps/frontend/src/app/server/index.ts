import { app } from '@rune-ts/server';
import { ClientRouter } from '../route';
import { faviconInterceptor } from './middlewares/favicon.interceptor';
import { mainRenderHandler, subRenderHandler } from '../../pages';
import { cartRenderHandler } from '../../pages/cart';
import { productEditRenderHandler } from '../../pages/products';

const server = app();

server.use(faviconInterceptor);

server.get(ClientRouter['/'].toString(), await mainRenderHandler(ClientRouter['/']));

server.get(ClientRouter['/sub'].toString(), await subRenderHandler(ClientRouter['/sub']));

server.get(ClientRouter['/carts'].toString(), await cartRenderHandler(ClientRouter['/carts']));

server.get(ClientRouter['/product-edit'].toString(), await productEditRenderHandler(ClientRouter['/product-edit']));

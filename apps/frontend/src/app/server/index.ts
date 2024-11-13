import { app } from '@rune-ts/server';
import { ClientRouter } from '../route';
import { faviconInterceptor } from './middlewares/favicon.interceptor';
import { mainRenderHandler, subRenderHandler } from '../../pages';

const server = app();

server.use(faviconInterceptor);

server.get(ClientRouter['/'].toString(), mainRenderHandler(ClientRouter['/']));

server.get(ClientRouter['/sub'].toString(), subRenderHandler(ClientRouter['/sub']));
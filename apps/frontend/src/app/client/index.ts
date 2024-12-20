import '../../../../../packages/styles/global.scss';
import { hydrate } from '@rune-ts/server';
import { ClientRouter } from '../route';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faShoppingCart, faUser, faReceipt, faSignOut } from '@fortawesome/free-solid-svg-icons';

library.add(faShoppingCart, faUser, faReceipt, faSignOut);
dom.watch();

hydrate(ClientRouter);

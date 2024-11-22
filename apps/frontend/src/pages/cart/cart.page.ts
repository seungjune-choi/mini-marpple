import { html, on, Page, type Html } from 'rune-ts';
import { Header, type HeaderProps } from '../../templates/header';
import { SideBar, type SideBarProps } from '../../templates/side-bar';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { type LayoutData, MetaView } from '@rune-ts/server';
import { cartRepository } from '../../repositories/carts';
import type { Cart } from '../../model';
import { CartChangedEvent, CartItemList, CartSummaryTable, OrderEvent } from '../../templates/carts';
import { orderRepository } from '../../repositories/orders';
import { paymentRepository } from '../../repositories/payments';

interface CartPageProps extends HeaderProps, SideBarProps {
  cart: Cart;
}

export class CartPage extends Page<CartPageProps> {
  private header = new Header({ isSigned: this.data.isSigned });
  private sideBar = new SideBar({ categories: this.data.categories });
  private cartItemList = new CartItemList({ items: this.data.cart.items });
  private cartSummaryTable = new CartSummaryTable({ summary: this.data.cart.summary });

  protected override template(): Html {
    return html`<div>
      ${this.header} ${this.sideBar}
      <div class="content horizontal">${this.cartItemList} ${this.cartSummaryTable}</div>
    </div>`;
  }

  @on(CartChangedEvent)
  async handleQuantityChange() {
    const cart = await cartRepository.findOne(this.data.cart.id);
    this.data.cart = cart;

    await this.cartItemList.rerender(this.data.cart.items);
    await this.cartSummaryTable.rerender(this.data.cart.summary);
  }

  @on(OrderEvent)
  private async handleOrderButtonClick() {
    const order = await orderRepository.create(this.data.cart.id);
    await paymentRepository.prepare(order.id);
    // 일반적으로 PG사 결제창에서 결제가 완료되면 web-hook으로 결제 완료 처리를 해야하지만 여기서는 생략합니다.
    await paymentRepository.complete(order.id);
    // TODO: 주문 완료 페이지로 이동합니다. 현재는 refresh로 대체합니다.
    window.location.reload();
  }
}

export const CartRoute = {
  '/carts': CartPage,
};

export const cartRenderHandler: RenderHandlerType<typeof CartPage> = (createCurrentPage) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, res) => {
    (async () => {
      const layoutData: LayoutData = {
        ...res.locals.layoutData,
      };

      const cart = await cartRepository.findOne(req.headers.cookie).catch(() => {
        return null;
      });

      if (!cart) {
        const referer = req.headers.referer;
        if (referer) {
          return res.send(`
            <script>
                alert('장바구니를 찾을 수 없습니다.');
                window.location.href = '${referer}';
            </script>`);
        } else {
          return res.status(404).send('Cart not found');
        }
      }
      const categories = req.categories;
      const isSigned = req.isSigned;

      res.send(new MetaView(createCurrentPage({ cart, categories, isSigned }), layoutData).toHtml());
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  };
};

import { Cart } from '@backend/core/cart.entity';
import { Injectable } from '@libs/decorators';

@Injectable()
export class ShippingFeeCalculator {
  /**
   * 배송비 계산, 단순하게 장바구니의 전체 물품 가격이 50,000원 이상이면 무료, 아니면 3,000원
   */
  calculate(cart: Cart): number {
    return cart.calculateItemsPrice() >= 50000 ? 0 : 3000;
  }
}

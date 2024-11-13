import { Cart } from '@backend/core';
import { InventoryReservationRepository } from '@backend/persistence';
import { Injectable } from '@libs/decorators';
import { UnprocessableEntityException } from '@libs/exceptions/http';

// TODO: 이 클래스는 도메인 서비스가 아닌지 확인해보기
@Injectable()
export class StockChecker {
  constructor(private readonly inventoryReservationRepository: InventoryReservationRepository) {}

  async check(cart: Cart): Promise<void> {
    const reservedQuantities = await this.inventoryReservationRepository.aggregateReservedQuantity(
      cart.items.map((item) => item.productId),
    );

    cart.items.forEach((item) => {
      const product = item.product;
      const reservedQuantity = reservedQuantities.get(product.id!) || 0;
      if (!product.hasStock(item.quantity + reservedQuantity)) {
        throw new UnprocessableEntityException(`${product.name} 의 재고가 부족합니다.`);
      }
    });
  }
}

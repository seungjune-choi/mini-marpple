import { Inject, Injectable } from '@libs/decorators';
import { FindManyOrderArgs, InventoryReservationRepository, OrderRepository } from '@backend/persistence';
import { DATA_SOURCE, DataSource } from '@libs/database';
import { Cart, Order } from '@backend/core';
import { ShippingFeeCalculator } from '@backend/usecase/shipping-fee-calculator';
import { InventoryReservation } from '@backend/core/inventory-reservation.entity';
import { Logger } from '@libs/logger';
import { StockChecker } from './stock.checker';
import { map, pipe, toArray } from '@fxts/core';

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);

  constructor(
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    private readonly orderRepository: OrderRepository,
    private readonly stockChecker: StockChecker,
    private readonly inventoryReservationRepository: InventoryReservationRepository,
    private readonly shippingFeeCalculator: ShippingFeeCalculator,
  ) {}

  async findOne(id: number): Promise<Order | null> {
    return await this.orderRepository.findOne(id);
  }

  async findMany(args: FindManyOrderArgs) {
    return await this.orderRepository.findMany({
      limit: args.limit || 10,
      cursor: args.cursor,
      userId: args.userId,
      status: args.status,
    });
  }

  async createFromCart(cart: Cart) {
    const shippingFee = this.shippingFeeCalculator.calculate(cart);

    // 재고 확인
    await this.stockChecker.check(cart);

    // 주문 생성 & 재고 예약
    return await this.dataSource.$transaction(async (tx) => {
      const createdOrder = await this.orderRepository.save(Order.fromCart(cart, shippingFee), tx);

      const inventoryReservations = pipe(
        cart.items,
        map((item) =>
          InventoryReservation.new({ orderId: createdOrder.id!, productId: item.productId, quantity: item.quantity }),
        ),
        toArray,
      );

      await this.inventoryReservationRepository.createMany(inventoryReservations, tx);

      return createdOrder;
    });
  }
}

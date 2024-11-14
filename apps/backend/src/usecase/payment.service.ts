import { Inject, Injectable } from '@libs/decorators';
import { Order, PaymentStatus, TargetUser } from '@backend/core';
import { Payment } from '@backend/core/payment.entity';
import { DATA_SOURCE, DataSource } from '@libs/database';
import {
  CartRepository,
  InventoryReservationRepository,
  OrderRepository,
  PaymentRepository,
  ProductRepository,
} from '@backend/persistence';
import { map, pipe, toArray } from '@fxts/core';
import { Logger } from '@libs/logger';
import { InternalServerErrorException } from '@libs/exceptions/http';

@Injectable()
export class PaymentService {
  private logger = new Logger(PaymentService.name);
  constructor(
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
    private readonly productRepository: ProductRepository,
    private readonly cartRepository: CartRepository,
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly inventoryReservationRepository: InventoryReservationRepository,
  ) {}

  async prepare(user: TargetUser, order: Order) {
    // TODO: portone 결제 준비 api 호출

    return Promise.resolve({
      merchantUid: order.merchantUid,
      amount: order.totalPrice,
      shippingFee: order.shippingFee,
      buyerEmail: user.email,
      buyerName: 'mock name',
      buyerTel: '010-1234-5678',
      buyerAddr: 'mock address',
      buyerPostcode: '12345',
    });
  }

  async complete(user: TargetUser, order: Order): Promise<void> {
    // TODO: portone 결제 정보 확인 api 호출 및 데이터 검증
    return await this.dataSource
      .$transaction(async (tx) => {
        // 결제 정보 저장
        await this.paymentRepository.save(
          Payment.new({
            amount: order.totalPrice,
            status: PaymentStatus.COMPLETED,
            userId: user.id,
            orderId: order.id,
            paymentDate: new Date(), // 원래 데이터는 api 응답에서 가져와야 함
            paymentMethod: 'credit_card', // 원래 데이터는 api 응답에서 가져와야 함
          }),
          tx,
        );

        // 주문 상태 변경
        const updatedOrder = await this.orderRepository.save(order.complete(), tx);
        this.logger.info(`Order ${updatedOrder.id} is completed`);

        // TODO: Order 엔티티 로직으로 수정 상품 재고 변경
        const products = pipe(
          order.items,
          map((item) => item.product.decrementStock(item.quantity)),
          toArray,
        );

        for await (const product of products) {
          await this.productRepository.updateStock(product.id!, product.stockQuantity, tx);
        }

        // 재고 예약 완료 처리
        await this.inventoryReservationRepository.release(order.id!, tx);
        this.logger.info(`Inventory reservation for order ${order.id} is released`);

        // 장바구니 초기화
        const cart = await this.cartRepository.findOneByUserId(user.id);
        if (cart) {
          await this.cartRepository.save(cart.clear(), tx);
        }
      })
      .catch((error) => {
        this.logger.error(error.message, error.stack);
        throw error;
      });
  }

  async cancel(order: Order): Promise<void> {
    // TODO: portone 결제 취소 api 호출

    await this.dataSource
      .$transaction(async (tx) => {
        // 결제 정보 변경
        const payment = await this.paymentRepository.findOneByOrderId(order.id!, tx);
        if (!payment) {
          throw new InternalServerErrorException('결제 정보를 찾을 수 없습니다');
        }
        await this.paymentRepository.save(payment.cancel(), tx);

        // 주문 상태 변경
        await this.orderRepository.save(order.cancel(), this.dataSource);

        // 상품 재고 변경
        const products = pipe(
          order.items,
          map((item) => item.product.incrementStock(item.quantity)),
          toArray,
        );

        for await (const product of products) {
          await this.productRepository.updateStock(product.id!, product.stockQuantity, tx);
        }
      })
      .catch((error) => {
        this.logger.error(error.message, error.stack);
        throw error;
      });
  }
}

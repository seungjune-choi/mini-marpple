import { Controller, Param, Post, User, UseMiddleware } from '@libs/decorators';
import { OrderService, PaymentService } from '@backend/usecase';
import { BadRequestException, ForbiddenException, NotFoundException } from '@libs/exceptions/http';
import { OrderStatus, type TargetUser } from '@backend/core';
import { ResponseEntity } from '@libs/rest';
import { withLock } from '@libs/lock';
import { AuthGuard } from '@libs/middlewares';

@Controller('/payments/v1')
export class PaymentControllerV1 {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @UseMiddleware(AuthGuard)
  @Post('prepare/order/:orderId')
  public async prepare(@User() user: TargetUser, @Param('orderId') orderId: string) {
    const order = await this.orderService.findOne(+orderId);
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }
    if (order.userId !== user.id) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return await this.paymentService.prepare(user, order).then(ResponseEntity.ok);
  }

  @UseMiddleware(AuthGuard)
  @Post('complete/order/:orderId')
  public async complete(@User() user: TargetUser, @Param('orderId') orderId: string) {
    const order = await this.orderService.findOne(+orderId);
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }

    if (order.userId !== user.id) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return await withLock(
      [`order`],
      10_000,
    )(this.paymentService.complete.bind(this.paymentService, user, order))
      .then(ResponseEntity.ok)
      .catch(() => {
        ResponseEntity.internalServerError('결제 처리 중 오류가 발생했습니다.');
      });
  }

  @UseMiddleware(AuthGuard)
  @Post('cancel/order/:orderId')
  public async cancel(@User() user: TargetUser, @Param('orderId') orderId: string) {
    const order = await this.orderService.findOne(+orderId);
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }

    if (order.userId !== user.id) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('취소할 수 없는 주문입니다.');
    }

    return await withLock(
      [`order`],
      10_000,
    )(this.paymentService.cancel.bind(this.paymentService, order))
      .then(ResponseEntity.ok)
      .catch(() => {
        ResponseEntity.internalServerError('결제 취소 중 오류가 발생했습니다.');
      });
  }
}

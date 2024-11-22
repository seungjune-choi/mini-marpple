import { Controller, Get, Param, Post, Query, UseMiddleware, User } from '@libs/decorators';
import { CartService, OrderService } from '@backend/usecase';
import type { TargetUser } from '@backend/core';
import { ForbiddenException, NotFoundException } from '@libs/exceptions/http';
import { withLock } from '@libs/lock';
import { ResponseEntity } from '@libs/rest';
import { FindManyOrderResponse } from './dto/response';
import { AuthGuard } from '@libs/middlewares';

@Controller('/orders/v1')
export class OrderControllerV1 {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
  ) {}

  @UseMiddleware(AuthGuard)
  @Get()
  public async findMany(
    @User() targetUser: TargetUser,
    @Query('limit') _limit: string,
    @Query('cursor') cursor?: string,
    @Query('status') status?: string,
  ) {
    const limit = _limit ? +_limit : 10;
    return await this.orderService
      .findMany({
        userId: targetUser.id,
        limit,
        cursor: cursor ? +cursor : undefined,
        status: status,
      })
      .then((res) => ResponseEntity.ok(FindManyOrderResponse.from(res, limit)));
  }

  @UseMiddleware(AuthGuard)
  @Post('/carts/:cartId')
  public async createFromCart(@User() targetUser: TargetUser, @Param('cartId') cartId: string) {
    const cart = await this.cartService.findOne(targetUser.id);
    if (!cart) {
      throw new NotFoundException('장바구니가 존재하지 않습니다.');
    }

    if (+cartId !== cart.id) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return await withLock(
      ['order:cart'],
      10_000,
    )(this.orderService.createFromCart.bind(this.orderService, cart)).then(ResponseEntity.created);
  }
}

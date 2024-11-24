import { Body, Controller, Delete, Get, Param, Patch, Post, UseMiddleware, User } from '@libs/decorators';
import { CartService, ProductService, ShippingFeeCalculator } from '@backend/usecase';
import { ResponseEntity } from '@libs/rest';
import type { TargetUser } from '@backend/core';
import { AuthGuard } from '@libs/middlewares';
import { NotFoundException } from '@libs/exceptions/http';
import { AddCartItemRequest, UpdateCartItemQuantityRequest } from './dto/request';
import { CartResponse } from './dto/response';

@Controller('/carts/v1')
export class CartControllerV1 {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly shippingFeeCalculator: ShippingFeeCalculator,
  ) {}

  @Get()
  @UseMiddleware([AuthGuard])
  public async findOne(@User() targetUser: TargetUser) {
    const cart = await this.cartService.findOne(targetUser.id);
    if (!cart) {
      throw new NotFoundException('장바구니가 존재하지 않습니다.');
    }

    const shippingFee = this.shippingFeeCalculator.calculate(cart);

    return ResponseEntity.ok(CartResponse.from(cart, shippingFee));
  }

  @Post('items')
  @UseMiddleware([AuthGuard])
  public async addItem(@User() targetUser: TargetUser, @Body() body: AddCartItemRequest) {
    const [cart, product] = await Promise.all([
      this.cartService.findOne(targetUser.id),
      this.productService.findOne(body.productId),
    ]).then(([cart, product]) => {
      if (!cart) {
        throw new NotFoundException('장바구니가 존재하지 않습니다.');
      }
      if (!product) {
        throw new NotFoundException('상품이 존재하지 않습니다.');
      }
      return [cart, product] as const;
    });

    return await this.cartService.addItem(cart, product, body.quantity).then(ResponseEntity.created);
  }

  @Delete('items/:itemId')
  @UseMiddleware([AuthGuard])
  public async removeItem(@User() targetUser: TargetUser, @Param('itemId') itemId: string) {
    const cart = await this.cartService.findOne(targetUser.id);
    if (!cart) {
      throw new NotFoundException('장바구니가 존재하지 않습니다.');
    }

    return await this.cartService.removeItem(cart, +itemId).then(ResponseEntity.ok);
  }

  @Patch('items/:itemId')
  @UseMiddleware([AuthGuard])
  public async updateItemQuantity(
    @User() targetUser: TargetUser,
    @Param('itemId') itemId: string,
    @Body() body: UpdateCartItemQuantityRequest,
  ) {
    console.log('updateItemQuantity', itemId, body.quantity);
    const cart = await this.cartService.findOne(targetUser.id);
    if (!cart) {
      throw new NotFoundException('장바구니가 존재하지 않습니다.');
    }

    return await this.cartService.updateItemQuantity(cart, +itemId, +body.quantity).then(ResponseEntity.ok);
  }
}

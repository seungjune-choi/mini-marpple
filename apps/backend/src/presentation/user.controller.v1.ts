import { Body, Controller, Get, Post, Req, Res, UseMiddleware, User } from '@libs/decorators';
import { AuthService, UserService } from '@backend/usecase';
import { ResponseEntity } from '@libs/rest';
import { AuthGuard, BodyValidator } from '@libs/middlewares';
import type { Request, Response } from 'express';
import type { TargetUser } from '@backend/core';
import { ConflictException } from '@libs/exceptions/http';
import { SignInRequest, CreateUserRequest } from './dto/request';
import { CreateUserResponse } from './dto/response';

@Controller('/users/v1')
export class UserControllerV1 {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  @UseMiddleware([AuthGuard])
  public me(@User() user: TargetUser) {
    return ResponseEntity.ok(user);
  }

  @Post('sign-in')
  @UseMiddleware([BodyValidator(SignInRequest)])
  public async signIn(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.authenticate(req, res);
    await this.authService.signIn(req, user);

    return ResponseEntity.ok(user);
  }

  @Post('sign-out')
  public async signOut(@Req() req: Request, @Res() res: Response) {
    return await this.authService.signOut(req, res).then(() => ResponseEntity.ok());
  }

  @Post()
  @UseMiddleware([BodyValidator(CreateUserRequest)])
  public async signUp(@Body() body: CreateUserRequest) {
    const exists = await this.userService.exists(body.email);
    if (exists) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    return await this.userService
      .create(body.toEntity())
      .then((user) => ResponseEntity.created(CreateUserResponse.fromEntity(user)))
      .catch(() => ResponseEntity.internalServerError());
  }
}

import { Injectable } from '@libs/decorators';
import passport from 'passport';
import { ForbiddenException, InternalServerErrorException } from '@libs/exceptions/http';
import type { Request, Response } from 'express';
import { TargetUser } from '@backend/core';

@Injectable()
export class AuthService {
  // 유저 인증
  async authenticate(req: Request, res: Response): Promise<TargetUser> {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err: unknown, user: TargetUser, info?: { message: string }) => {
        if (err || !user) {
          // 인증 실패
          (req as any).session.destroy((err: unknown) => {
            if (err) {
              console.error(err);
              reject(new InternalServerErrorException());
            }
            res.clearCookie('_sid_');
            reject(new ForbiddenException(info?.message));
          });
        } else {
          resolve(user);
        }
      })(req, res);
    });
  }

  // 유저 로그인 처리
  async signIn(req: Request, user: TargetUser): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      req.login(user, (err) => {
        if (err) {
          reject(new ForbiddenException());
        } else {
          resolve();
        }
      });
    });
  }
}
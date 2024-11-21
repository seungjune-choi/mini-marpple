import type { TargetUser } from '../../../../backend/src/core';
import type { ResponseEntity } from '../../model';
import { baseClient } from '../../web-client';
import type { IUserRepository, SignInRequest, SignInResponse } from './user.repository.interface';

export class UserRepository implements IUserRepository {
  signIn(request: SignInRequest): Promise<SignInResponse> {
    return baseClient.post<ResponseEntity<TargetUser>>('/users/v1/sign-in', { ...request }).then((res) => res.data);
  }
}

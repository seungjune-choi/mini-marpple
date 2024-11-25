import type { ResponseEntity, TargetUser } from '../../model';
import { baseClient } from '../../web-client';
import type { IUserRepository, SignInRequest, SignInResponse } from './user.repository.interface';

export class UserRepository implements IUserRepository {
  signIn(request: SignInRequest): Promise<SignInResponse> {
    return baseClient.post<ResponseEntity<TargetUser>>('/users/v1/sign-in', { ...request }).then((res) => res.data);
  }

  me(cookie?: string): Promise<TargetUser | null> {
    return baseClient
      .post<ResponseEntity<TargetUser>>('/users/v1/me', { ...((cookie && { headers: { Cookie: cookie } }) ?? {}) })
      .then((res) => res.data.data)
      .catch(() => null);
  }
}

export const userRepository = new UserRepository();

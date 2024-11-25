import type { ResponseEntity } from '../../model';
import type { TargetUser } from '../../model/user.model';

export type SignInRequest = Pick<TargetUser, 'email'> & { password: string };

export type SignInResponse = ResponseEntity<TargetUser>;

export interface IUserRepository {
  signIn(request: SignInRequest): Promise<SignInResponse>;
  me(cookie?: string): Promise<TargetUser | null>;
}

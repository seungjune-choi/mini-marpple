import type { IUserRepository, SignInRequest, SignInResponse } from './user.repository.interface';
import { delay } from '../../utils';

export class MockUserRepository implements IUserRepository {
  public async signIn(request: SignInRequest): Promise<SignInResponse> {
    console.log('Sign in request:', request);
    await delay(500);
    return Promise.resolve({ message: 'OK' });
  }
}
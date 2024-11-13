import { Injectable } from '@libs/decorators';
import { UserRepository } from '@backend/persistence';
import { User } from 'src/core';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 새 유저, cart 생성
   * @param request
   */
  public create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  /**
   * email로 유저 존재 여부 확인
   */
  public exists(email: string): Promise<boolean> {
    return this.userRepository.exists(email);
  }
}

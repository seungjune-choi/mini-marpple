import { BaseEntity } from '@backend/core/base.entity';
import { Exclude, Expose } from 'class-transformer';
import { Cart } from '@backend/core/cart.entity';

export class User extends BaseEntity<number> {
  @Expose({ name: 'email' })
  public email!: string;

  @Expose({ name: 'password' })
  public password!: string;

  @Expose({ name: 'is_admin' })
  public isAdmin!: boolean;

  @Exclude()
  public cart!: Cart;

  constructor(data: Partial<User>) {
    super();
    Object.assign(this, data);
  }

  public static new(data: Pick<User, 'email' | 'password'> & Partial<Pick<User, 'isAdmin'>>): User {
    return new User({ ...data, cart: Cart.new() });
  }
}

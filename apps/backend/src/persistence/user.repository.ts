import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource, TransactionClient } from '@libs/database';
import { Cart, User } from 'src/core';
import { CartScheme, UserScheme } from '@backend/persistence/scheme';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import * as console from 'node:console';

@Injectable()
export class UserRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  public save(user: User) {
    return this.dataSource.$transaction(async (tx) => this.create(user, tx));
  }

  public exists(email: string): Promise<boolean> {
    return this.dataSource.$query<{ id: number }>`
      SELECT 
        id
      FROM
        users
      WHERE
        email = ${email}
    `.then((result) => result.length > 0);
  }

  public async create(user: User, tx?: TransactionClient): Promise<User> {
    try {
      const createdUser = await (tx ?? this.dataSource).$query<UserScheme>`
      INSERT INTO users ${this.dataSource.$values([instanceToPlain(user, { exposeUnsetFields: false })])} RETURNING *
    `.then(([scheme]) => plainToInstance(User, scheme));

      const cart = await (tx ?? this.dataSource).$query<CartScheme>`
      INSERT INTO carts ${this.dataSource.$values([{ user_id: createdUser.id }])} RETURNING *
    `.then(([scheme]) => plainToInstance(Cart, scheme));

      createdUser.cart = cart;
      return createdUser;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

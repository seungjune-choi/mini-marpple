import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource, TransactionClient } from '@libs/database';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Cart, CartItem, Product, ProductImage } from 'src/core';
import { CartItemScheme, CartScheme, FindOneCartAssociationScheme } from '@backend/persistence/scheme';
import * as console from 'node:console';

@Injectable()
export class CartRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  /**
   * if cart has an id, update it in the database else create a new cart
   */
  async save(cart: Cart, tx?: TransactionClient): Promise<Cart> {
    if (tx) {
      return cart.id ? this.update(cart, tx) : this.create(cart, tx);
    } else {
      return this.dataSource.$transaction(async (tx) => {
        return cart.id ? this.update(cart, tx) : this.create(cart, tx);
      });
    }
  }

  async create(cart: Cart, tx?: TransactionClient): Promise<Cart> {
    return await (tx ?? this.dataSource).$query<CartScheme>`
      INSERT INTO carts ${this.dataSource.$values([instanceToPlain(cart, { exposeUnsetFields: false })])} RETURNING *`
      .then(([scheme]) => plainToInstance(Cart, scheme))
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  async update(cart: Cart, tx?: TransactionClient): Promise<Cart> {
    // update cart
    const updatedCart = await (tx ?? this.dataSource).$query<CartScheme>`
      UPDATE 
        carts
      SET
        updated_at = NOW() 
      WHERE 
        id = ${cart.id}
      RETURNING *`.then(([scheme]) => plainToInstance(Cart, scheme));

    const originalItemIds = await (tx ?? this.dataSource).$query<CartItemScheme>`
      SELECT id FROM cart_items WHERE cart_id = ${cart.id}`.then((items) => items.map((item) => item.id));

    // 지워진 아이템을 찾아서 삭제 (soft delete)
    const deletedItemIds = originalItemIds.filter((id) => !cart.items.some((item) => item.id === id));
    if (deletedItemIds.length) {
      await (tx ?? this.dataSource).$query`
        UPDATE 
            cart_items
        SET
            deleted_at = NOW()
        WHERE
          ${this.dataSource.$in('id', deletedItemIds)}`;
    }

    // 새로 추가된 아이템을 찾아서 추가
    const newItems = cart.items.filter((i) => !i.id);
    if (newItems.length) {
      await (tx ?? this.dataSource).$query<CartItemScheme>`
        INSERT INTO cart_items ${this.dataSource.$values(newItems.map((item) => instanceToPlain(item, { exposeUnsetFields: false })))}`;
    }

    // 변경된 아이템을 찾아서 업데이트
    const updatedItems = cart.items.filter((i) => !!i.id);

    for await (const cartItem of updatedItems) {
      await (tx ?? this.dataSource).$query<CartItemScheme>`
        UPDATE 
            cart_items 
        ${this.dataSource.$set({
          quantity: cartItem.quantity,
          updated_at: new Date(),
          deleted_at: cartItem.deletedAt,
        })}
        WHERE 
            id = ${cartItem.id}
        RETURNING *`.then(([scheme]) => plainToInstance(CartItem, scheme));
    }

    // --- 쿼리를 줄이기 위해 이 코드가 돌아가야 하지만 안돌아감
    // if (updatedItems.length) {
    //   await (tx ?? this.dataSource).$query`
    //     UPDATE
    //         cart_items
    //     SET
    //         ${this.dataSource.$sql`quantity = CASE ${updatedItems.map((item) => this.dataSource.$sql`WHEN id = ${item.id} THEN ${item.quantity}`).join(' ')} ELSE quantity END`}
    //     WHERE ${this.dataSource.$in(
    //       'id',
    //       updatedItems.map((item) => item.id!),
    //     )}`;
    // }
    // reload items
    updatedCart.items = await (tx ?? this.dataSource).$query<CartItemScheme>`
      SELECT * FROM cart_items WHERE cart_id = ${cart.id} AND deleted_at IS NULL`.then((items) =>
      items.map((item) => plainToInstance(CartItem, item)),
    );

    return updatedCart;
  }

  async findOneByUserId(userId: number): Promise<Cart | null> {
    return await this.dataSource.$associate<FindOneCartAssociationScheme>`
      carts ${this.dataSource.$sql`WHERE user_id = ${userId} AND deleted_at IS NULL`}
        < cart_items ${this.dataSource.$sql`WHERE deleted_at IS NULL`}
          - product
            < product_images ${this.dataSource.$sql`WHERE is_representative = true`}
      `
      .then(([scheme]) => {
        return scheme
          ? Cart.from({
              id: scheme.id,
              userId: scheme.user_id,
              createdAt: scheme.created_at,
              updatedAt: scheme.updated_at,
              deletedAt: scheme.deleted_at,
              items: scheme._.cart_items.map((itemScheme) =>
                CartItem.from({
                  id: itemScheme.id,
                  productId: itemScheme.product_id,
                  cartId: itemScheme.cart_id,
                  quantity: itemScheme.quantity,
                  updatedAt: itemScheme.updated_at,
                  createdAt: itemScheme.created_at,
                  deletedAt: itemScheme.deleted_at,
                  product: Product.from({
                    id: itemScheme._.product.id,
                    name: itemScheme._.product.name,
                    price: itemScheme._.product.price,
                    createdAt: itemScheme._.product.created_at,
                    updatedAt: itemScheme._.product.updated_at,
                    deletedAt: itemScheme._.product.deleted_at,
                    categoryId: itemScheme._.product.category_id,
                    stockQuantity: itemScheme._.product.stock_quantity,
                    description: itemScheme._.product.description,
                    hidden: itemScheme._.product.hidden,
                    images: itemScheme._.product._.product_images.map((imageScheme) =>
                      ProductImage.from({
                        id: imageScheme.id,
                        productId: imageScheme.product_id,
                        deletedAt: imageScheme.deleted_at,
                        updatedAt: imageScheme.updated_at,
                        createdAt: imageScheme.created_at,
                        isRepresentative: imageScheme.is_representative,
                        path: imageScheme.path,
                      }),
                    ),
                  }),
                }),
              ),
            })
          : null;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}

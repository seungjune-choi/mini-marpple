import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource, TransactionClient } from '@libs/database';
import { Order, OrderItem, Product } from '@backend/core';
import { FindOneOrderAssociationScheme, OrderItemScheme, OrderScheme } from '@backend/persistence/scheme';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map, pipe, toArray } from '@fxts/core';
import { Logger } from '@libs/logger';
import { FindManyOrderResult } from './result';

export interface FindManyOrderArgs {
  /**
   * @default 10
   */
  limit?: number;

  cursor?: number;

  userId: number;

  status?: string;
}

@Injectable()
export class OrderRepository {
  private logger = new Logger(OrderRepository.name);
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  async findOne(id: number): Promise<Order | null> {
    return await this.dataSource.$associate<FindOneOrderAssociationScheme>`
      orders ${this.dataSource.$sql`WHERE id = ${id}`}
        < order_items ${this.dataSource.$sql`WHERE deleted_at IS NULL`}
          - product
      `
      .then(([scheme]) => {
        if (!scheme) return null;
        const order = plainToInstance(Order, scheme, { excludeExtraneousValues: true });
        order.items = scheme._.order_items.map((item) =>
          OrderItem.from({
            id: item.id,
            orderId: item.order_id,
            productId: item.product_id,
            quantity: item.quantity,
            priceAtOrder: item.price_at_order,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            deletedAt: item.deleted_at,
            product: plainToInstance(Product, item._.product),
          }),
        );
        return order;
      })
      .catch((error: Error) => {
        this.logger.error(error.message, error.stack);
        throw error;
      });
  }

  async findMany(args: FindManyOrderArgs): Promise<FindManyOrderResult[]> {
    console.log(args);
    return await this.dataSource.$query<FindManyOrderResult>`
      SELECT 
        o.id AS id,
        o.merchant_uid AS merchantUid,
        o.total_price AS totalPrice,
        o.created_at AS createdAt,
        o.updated_at AS updatedAt,
        o.status AS status,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', oi.id,
            'product', JSON_BUILD_OBJECT(
              'id', p.id,
              'name', p.name,
              'representative_image', JSON_BUILD_OBJECT(
                'id', pi.id,
                'url', pi.path
              )
            ),
            'quantity', oi.quantity,
            'priceAtOrder', oi.price_at_order
          )
        ) AS items,
        JSON_BUILD_OBJECT(
          'id', pay.id,
          'amount', pay.amount,
          'method', pay.payment_method,
          'status', pay.status,
          'paymentDate', pay.payment_date
        ) AS payment
      FROM
        orders o
      LEFT JOIN 
        payments pay ON o.id = pay.order_id
      JOIN 
        order_items oi ON o.id = oi.order_id
      JOIN 
        products p ON oi.product_id = p.id
      JOIN 
        product_images pi ON p.id = pi.product_id AND pi.is_representative = TRUE
      WHERE
        o.user_id = ${args.userId}
        ${args.cursor ? this.dataSource.$sql`AND o.id < ${args.cursor}` : this.dataSource.$sql``}
        ${args.status ? this.dataSource.$sql`AND o.status = ${args.status}::text` : this.dataSource.$sql``}
      GROUP BY
        o.id, o.merchant_uid, o.total_price, o.created_at, o.updated_at, o.status, pay.id
      ORDER BY 
        o.id DESC
      LIMIT
        ${args.limit}
      
    `;
  }
  // async findMany(args: FindManyOrderArgs) {
  //   return await this.dataSource.$associate`
  //     orders ${this.dataSource.$sql`WHERE user_id = ${args.userId} ORDER BY id DESC LIMIT 3`}
  //       - payments ${{ left_key: 'id', key: 'order_id' }}
  //       < order_items ${this.dataSource.$sql`WHERE deleted_at IS NULL`}
  //         - products
  //   `.catch((error: Error) => {
  //     this.logger.error(error.message, error.stack);
  //     throw error;
  //   });
  // }

  async save(order: Order, tx?: TransactionClient): Promise<Order> {
    if (tx) {
      return order.id ? this.update(order, tx) : this.create(order, tx);
    } else {
      return this.dataSource.$transaction(async (tx) => {
        return order.id ? this.update(order, tx) : this.create(order, tx);
      });
    }
  }

  async create(order: Order, tx: TransactionClient): Promise<Order> {
    // Order 생성
    const createdOrder = await tx.$query<OrderScheme>`
      INSERT INTO orders ${this.dataSource.$values([instanceToPlain(order, { exposeUnsetFields: false })])} RETURNING *`
      .then(([scheme]) => plainToInstance(Order, scheme))
      .catch((error) => {
        console.error(error);
        throw error;
      });

    // OrderItem 생성
    const orderItems = pipe(
      order.items,
      map((i) => i.setOrderId(createdOrder.id!)),
      map((item) => instanceToPlain(item, { exposeUnsetFields: false })),
      toArray,
    );

    const createdOrderItems = await tx.$query<OrderItemScheme>`
      INSERT INTO order_items ${this.dataSource.$values(orderItems)} RETURNING *`
      .then((schemes) => schemes.map((scheme) => plainToInstance(OrderItem, scheme)))
      .catch((error) => {
        console.error(error);
        throw error;
      });

    createdOrder.items = createdOrderItems;
    return createdOrder;
  }

  async update(order: Order, tx: TransactionClient): Promise<Order> {
    return await tx.$query<OrderScheme>`
      UPDATE 
        orders 
      ${this.dataSource.$set(instanceToPlain(order, { exposeUnsetFields: false }))} 
      WHERE 
        id = ${order.id} 
      RETURNING *`
      .then(([scheme]) => plainToInstance(Order, scheme))
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}

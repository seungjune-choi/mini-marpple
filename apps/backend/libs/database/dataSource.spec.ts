import { DataSource } from './dataSource';

describe('DataSource', () => {
  const sut: DataSource = new DataSource({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });

  beforeAll(async () => {
    await sut.$connect();
  });

  afterAll(async () => {
    await sut.$disconnect();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  // describe('$query', () => {
  //   it('쿼리 정상 동작', async () => {
  //     const [result] = await sut.$query<{ id: number }>`SELECT 1 as id`;
  //     expect(result).toEqual({ id: 1 });
  //   });
  // });

  // describe('$values', () => {
  //   afterAll(async () => {
  //     await sut.$query`TRUNCATE TABLE users RESTART IDENTITY`;
  //   });

  //   it('insert values', async () => {
  //     // Arrange
  //     const user = {
  //       email: 'test',
  //       password: 'test',
  //       is_admin: false,
  //     };

  //     // Act
  //     await sut.$query`INSERT INTO users ${sut.$values([user])}`;

  //     // Assert
  //     const [res] = await sut.$query`SELECT * FROM users WHERE email LIKE 'test%'`;
  //     expect(res).toMatchObject({ email: 'test', password: 'test', is_admin: false });
  //   });
  // });

  // describe('$transaction / callback', () => {
  //   afterAll(async () => {
  //     await sut.$query`TRUNCATE TABLE users RESTART IDENTITY`;
  //   });

  //   it('트랜잭션 내부에서 쿼리 실행', async () => {
  //     await sut.$transaction(async ({ $query }) => {
  //       const [res] = await $query`SELECT 1 as id`;
  //       expect(res).toEqual({ id: 1 });
  //     });
  //   });

  //   it('트랜잭션 내부에서 에러 발생 시 롤백', async () => {
  //     // Arrange
  //     const user = {
  //       email: 'test',
  //       password: 'test',
  //       is_admin: false,
  //     };

  //     // Act
  //     try {
  //       await sut.$transaction(async ({ $query }) => {
  //         await $query`INSERT INTO users ${sut.$values([user])}`;
  //         throw new Error('unknown error');
  //       });
  //     } catch (error) {
  //       // Assert
  //       const [res] = await sut.$query`SELECT * FROM users WHERE email LIKE 'test'`;
  //       expect(res).toBeUndefined();
  //     }
  //   });
  // });

  // describe('$transaction / runner', () => {
  //   afterAll(async () => {
  //     await sut.$query`TRUNCATE TABLE users RESTART IDENTITY`;
  //   });

  //   it('트랜잭션 내부에서 에러 발생 시 롤백', async () => {
  //     // Arrange
  //     const user = {
  //       email: 'test',
  //       password: 'test',
  //       is_admin: false,
  //     };

  //     // Act
  //     const runner = await sut.$transaction();
  //     await runner.$query`INSERT INTO users ${sut.$values([user])}`;
  //     await runner.$rollback();

  //     // Assert
  //     const [res] = await sut.$query`SELECT * FROM users WHERE email LIKE 'test%'`;
  //     expect(res).toBeUndefined();
  //   });
  // });

  // describe('cursor based pagination', () => {
  //   it('with cursor', async () => {
  //     // Arrange
  //     const limit = 3;
  //     const cursor = 0;
  //     const categoryId = 0;
  //     const res = await sut.$query`
  //     WITH main_ids AS (
  //       SELECT
  //         id
  //       FROM
  //         products
  //       WHERE
  //         1 = 1
  //       ${categoryId ? sut.$sql`AND id = ${categoryId}` : sut.$sql``}
  //       ${cursor ? sut.$sql`AND id > ${cursor}` : sut.$sql``}
  //       ORDER BY
  //         id ASC
  //       LIMIT
  //         ${limit}
  //     )
  //     SELECT
  //       p.id as id,
  //       p.name as name,
  //       p.hidden as hidden,
  //       p.created_at as "createdAt",
  //       p.updated_at as "updatedAt",
  //       p.price as price,
  //       c.id as "categoryId",
  //       c.name as "categoryName",
  //       pi.id as "imageId",
  //       pi.path as "imagePath"
  //     FROM
  //       main_ids
  //     LEFT JOIN
  //       product_images pi ON pi.product_id = main_ids.id AND pi.is_representative = true
  //     LEFT JOIN
  //       products p ON p.id = main_ids.id
  //     LEFT JOIN
  //       categories c ON c.id = p.category_id
  //     ORDER BY
  //       p.id ASC,
  //       pi.id ASC
  //     `;
  //
  //     // Assert
  //     console.log(res);
  //     console.log(res.length);
  //     expect(res).toHaveLength(10);
  //     expect(res[0].product_id).toBeGreaterThan(cursor);
  //   });
  // });

  describe('update multiple rows', () => {
    // let testUserId: number;
    // let testCartId: number;
    //
    // beforeAll(async () => {
    //   // add test user
    //   const userIds = await sut.$query<{
    //     id;
    //   }>`INSERT INTO users ${sut.$values([{ email: 'test', password: 'test', is_admin: false }])} RETURNING id`;
    //   testUserId = userIds[0].id;
    //
    //   // add test cart
    //   const cartIds = await sut.$query<{
    //     id;
    //   }>`INSERT INTO carts ${sut.$values([{ user_id: userIds[0].id }])} RETURNING id`;
    //   testCartId = cartIds[0].id;
    //
    //   // add test cart item
    //   await sut.$query`INSERT INTO cart_items ${sut.$values([{ cart_id: testCartId, product_id: 1, quantity: 1 }])}`;
    //   await sut.$query`INSERT INTO cart_items ${sut.$values([{ cart_id: testCartId, product_id: 2, quantity: 2 }])}`;
    // });
    //
    // afterAll(async () => {
    //   // await sut.$query`DELETE FROM cart_items`;
    //   // await sut.$query`DELETE FROM carts`;
    //   // await sut.$query`DELETE FROM users WHERE email = 'test'`;
    // });

    it('conditional update', async () => {
      // Arrange
      const cartItems = await sut.$query<{
        id;
        cart_id;
        product_id;
        quantity;
      }>`SELECT * FROM cart_items WHERE cart_id = 12`;

      // Act
      const updatedItems = cartItems.map((item) => ({ ...item, quantity: item.quantity + 1 }));
      const res = [] as any[];
      for await (const cartItem of updatedItems) {
        res.push(
          await sut.$query`
          UPDATE 
              cart_items 
          ${sut.$set({
            quantity: cartItem.quantity,
          })}
          WHERE 
              id = ${cartItem.id}
          RETURNING *`,
        );
      }

      console.log(res);
      // console.log(updatedItems);
    });
  });
});

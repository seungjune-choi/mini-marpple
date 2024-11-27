import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource, TransactionClient } from '@libs/database';
import {
  FindManyProductScheme,
  FindOneAssociationScheme,
  ProductImageScheme,
  ProductScheme,
} from '@backend/persistence/scheme';
import { Product, ProductImage } from 'src/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map, pipe, toArray } from '@fxts/core';
import { FindManyProductResult } from './result';
import * as console from 'node:console';

export interface FindManyProductArgs {
  /**
   * @default 10
   */
  limit?: number;

  cursor?: number;

  categoryId?: number;
}

@Injectable()
export class ProductRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  /**
   *
   * find one product by id with product images
   * @param id
   * @returns
   */
  findOne = (id: number) =>
    this.dataSource.$associate<FindOneAssociationScheme>`
      products ${this.dataSource.$sql`WHERE id = ${id}`}
        < product_images
    `
      .then((res) => {
        if (!res) return null;
        const [scheme] = res;
        return Product.from({
          id: scheme.id,
          categoryId: scheme.category_id,
          name: scheme.name,
          description: scheme.description,
          price: scheme.price,
          stockQuantity: scheme.stock_quantity,
          createdAt: scheme.created_at,
          updatedAt: scheme.updated_at,
          deletedAt: scheme.deleted_at,
          hidden: scheme.hidden,
          images: scheme._.product_images.map((scheme) => plainToInstance(ProductImage, scheme)),
        });
      })
      .catch((e) => {
        console.error(e);
        return null;
      });

  /**
   * find all products (with representative image)
   * - limit: number of products to fetch
   * - cursor: cursor for pagination
   * - productId: filter by product id
   * @returns
   *  - brief information of products
   */
  async findMany({ limit, cursor, categoryId }: FindManyProductArgs): Promise<FindManyProductResult[]> {
    return await this.dataSource.$query<FindManyProductScheme>`
      WITH main_ids AS (
        SELECT 
          id 
        FROM 
          products
        WHERE 
          1 = 1
        ${categoryId ? this.dataSource.$sql`AND category_id = ${categoryId}` : this.dataSource.$sql``}
        ${cursor ? this.dataSource.$sql`AND id < ${cursor}` : this.dataSource.$sql``}
          AND stock_quantity > 0
        ORDER BY
          id DESC
        LIMIT 
          ${limit}
      )
      SELECT
        p.id as id,
        p.name as name,
        p.price as price,
        p.description as description,
        p.hidden as hidden,
        p.created_at as "createdAt",
        p.updated_at as "updatedAt",
        pi.id as "representativeImageId",
        pi.path as "representativeImagePath",
        c.id as "categoryId", c.name as "categoryName"
      FROM
        main_ids
      JOIN
        products p ON p.id = main_ids.id
      LEFT JOIN
        product_images pi ON pi.product_id = main_ids.id AND pi.is_representative = true
      JOIN 
        categories c ON p.category_id = c.id
      ORDER BY
        p.id DESC,
        pi.id ASC
    `.then((res) =>
      res.map((scheme) => ({
        id: scheme.id,
        name: scheme.name,
        price: scheme.price,
        description: scheme.description,
        hidden: scheme.hidden,
        createdAt: scheme.createdAt,
        updatedAt: scheme.updatedAt,
        representativeImage: {
          id: scheme.representativeImageId,
          url: scheme.representativeImagePath,
        },
        category: {
          id: scheme.categoryId,
          name: scheme.categoryName,
        },
      })),
    );
  }

  /**
   * upsert product
   * @description
   * - if product.id is not set, insert new product and return it
   * - if product.id is set, update product and return it
   */
  async save(product: Product): Promise<Product> {
    return product.id ? this.update(product) : this.create(product);
  }

  /**
   * update product
   * @description
   * - update product by id and return it
   */
  update(product: Product): Promise<Product> {
    return this.dataSource.$transaction(async (tx) => {
      // update product
      const updatedProduct = await tx.$query<ProductScheme>`
          UPDATE products
            ${this.dataSource.$set(this.#productToPlain(product))}
          WHERE
            id = ${product.id} 
          RETURNING *`.then(([product]) => this.#plainToProduct(product));

      // update images
      const originImageIds = await pipe(
        tx.$query<{ id: number }>`
            SELECT id FROM product_images WHERE product_id = ${updatedProduct.id!}`,
        map(({ id }) => id),
        toArray,
      ).then((ids) => new Set(ids));

      // 새로 추가된 이미지는 업데이트, 삭제된 이미지는 삭제
      // const thumbnailsToUpdate = product.images.filter((img) => !originImageIds.has(img.id!));
      const imageToDelete = Array.from(originImageIds).filter((id) => !product.images.some((thumb) => thumb.id === id));
      const representativeImageId = product.images.find((i) => i.isRepresentative)?.id;

      // 대표 이미지 설정 초기화 (유니크 제약 때문에)
      await tx.$query`
        UPDATE 
            product_images
        SET 
            is_representative = FALSE
        WHERE 
            product_id = ${updatedProduct.id!}`;
      console.log('first');
      await tx.$query`
        UPDATE 
            product_images
        SET 
            product_id = ${product.id},
            updated_at = NOW(),
            is_representative = CASE WHEN id = ${representativeImageId} THEN true ELSE false END
        WHERE 
            ${this.dataSource.$in(
              'id',
              product.images.map((i) => i.id!),
            )}`;
      console.log('second');
      if (imageToDelete.length) {
        await tx.$query`
          DELETE 
          FROM 
            product_images
          WHERE
            ${this.dataSource.$in('id', imageToDelete)}`;
      }
      console.log('third');
      // reload images
      updatedProduct.images = await tx.$query<ProductImageScheme>`
        SELECT * FROM product_images WHERE product_id = ${updatedProduct.id!}`.then((images) =>
        images.map((i) => plainToInstance(ProductImage, i)),
      );

      return updatedProduct;
    });
  }

  /**
   * create product
   * @description
   * - insert new product and return it
   */
  create(product: Product): Promise<Product> {
    return this.dataSource.$transaction(async (tx) => {
      // insert product
      const createdProduct = await tx.$query<ProductScheme>`
          INSERT INTO products
            ${this.dataSource.$values([this.#productToPlain(product)])}
          RETURNING *`
        .then(([product]) => product)
        .then(this.#plainToProduct);

      // update images
      const images = product.images.map((thumb) => thumb.setProductId(createdProduct.id!));
      if (!images.length) return createdProduct;
      const representativeImageId = images.find((i) => i.isRepresentative)?.id;

      createdProduct.images = await tx.$query<ProductImageScheme>`
        UPDATE 
            product_images
        SET 
            product_id = ${createdProduct.id}, 
            updated_at = NOW(),
            is_representative = CASE WHEN id = ${representativeImageId} THEN true ELSE false END
        WHERE 
            ${this.dataSource.$in(
              'id',
              images.map((i) => i.id!),
            )}
        RETURNING *`.then((images) => images.map((i) => plainToInstance(ProductImage, i)));

      return createdProduct;
    });
  }

  // TODO: save 에서 tx 주입할 수 있게 수정하여 도메인 로직으로 처리
  updateStock = (productId: number, quantity: number, tx?: TransactionClient) => {
    return (tx ?? this.dataSource).$query`
      UPDATE 
          products
      SET 
          stock_quantity = ${quantity}
      WHERE 
          id = ${productId}
    `;
  };

  #plainToProduct = (scheme: ProductScheme) => plainToInstance(Product, scheme);
  #productToPlain = (product: Product) => instanceToPlain(product, { exposeUnsetFields: false });
}

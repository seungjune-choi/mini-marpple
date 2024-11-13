import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource } from '@libs/database';
import { ProductImage } from 'src/core';
import { ProductImageScheme } from '@backend/persistence/scheme';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class ProductImageRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  createMany = (images: ProductImage[]): Promise<{ id: number }[]> =>
    this.dataSource.$query<{ id: number }>`
      INSERT INTO 
        product_images 
      ${this.dataSource.$values(images.map((img) => instanceToPlain(img, { exposeUnsetFields: false })))} 
      RETURNING id`;

  findManyByIds = (ids: number[]): Promise<ProductImage[]> => {
    return this.dataSource.$query<ProductImageScheme>`
      SELECT 
        * 
      FROM 
        product_images 
      WHERE 
        ${this.dataSource.$in('id', ids)}
    `.then((schemes) => schemes.map((scheme) => plainToInstance(ProductImage, scheme)));
  };
}

import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource } from '@libs/database';
import { ProductImage } from 'src/core';
import { ProductImageScheme } from '@backend/persistence/scheme';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class ProductImageRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  create = (image: ProductImage): Promise<{ id: number; path: string }> =>
    this.dataSource.$query<{ id: number; path: string }>`
      INSERT INTO 
        product_images 
      ${this.dataSource.$values([instanceToPlain(image, { exposeUnsetFields: false })])} 
      RETURNING id, path
      `.then(([result]) => result);

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

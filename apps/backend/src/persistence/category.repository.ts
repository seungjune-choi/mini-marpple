import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource } from '@libs/database';
import { map, pipe, take, toArray } from '@fxts/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CategoryScheme } from '@backend/persistence/scheme';
import { Category } from 'src/core';

@Injectable()
export class CategoryRepository {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  save = (category: Category): Promise<Category> =>
    pipe(
      this.dataSource.$query<CategoryScheme>`
        INSERT INTO categories 
          ${this.dataSource.$values([instanceToPlain(category, { exposeUnsetFields: false })])} 
        RETURNING *`,
      take(1),
      map((category) => plainToInstance(Category, category)),
      toArray,
    ).then(([category]) => category);

  findMany(): Promise<{ id: number; name: string }[]> {
    return this.dataSource.$query<{ id: number; name: string }>`SELECT id, name FROM categories`;
  }
}

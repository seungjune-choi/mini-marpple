import { z } from 'zod';
import type { PartialOptional } from '../../../../packages/types/partial-optional';
import type { Product } from '../model';
import { BindModel } from './bind-model';
import { every, filter, map, pipe } from '@fxts/core';

export class ProductBindModel extends BindModel<PartialOptional<Product, 'id' | 'createdAt' | 'updatedAt'>> {
  private _schema = z.object({
    name: z.string().min(2).max(100),
    price: z.number().positive().min(1000).max(100_000_000),
    description: z.string().min(2).max(1000),
    hidden: z.boolean(),
    stockQuantity: z.number().min(1).max(1000).nonnegative(),
    categoryId: z.number().int().positive(),
    images: z
      .array(
        z.object({
          id: z.number(),
          isRepresentative: z.boolean(),
        }),
      )
      .min(1),
  });

  constructor(args?: Product) {
    super(
      args ?? {
        name: '',
        description: '',
        price: 0,
        images: [],
        hidden: false,
        stockQuantity: 0,
        categoryId: 0,
      },
    );
  }

  override validate<K extends keyof PartialOptional<Product, 'id' | 'createdAt' | 'updatedAt'>>(key?: K) {
    if (key) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this._schema.pick({ [key]: true } as any).safeParse({
        [key]: this.value[key],
      }).success;
    }

    return this._validateImages() && this._schema.safeParse(this.value).success;
  }

  private _validateImages() {
    return pipe(
      this.value.images,
      map((img) => img.src),
      filter((src) => src instanceof File),
      every((f) => f.size < 10_000_000 && f.type.startsWith('image')),
    );
  }
}

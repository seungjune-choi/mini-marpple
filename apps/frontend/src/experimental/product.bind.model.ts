import { z } from 'zod';
import type { PartialOptional } from '../../../../packages/types/partial-optional';
import type { Product } from '../model';
import { BindModel } from './bind-model';

export class ProductBindModel extends BindModel<PartialOptional<Product, 'id' | 'createdAt' | 'updatedAt'>> {
  private _schema = z.object({
    name: z.string().min(2).max(100),
    price: z.number().positive().min(1000).max(100_000_000),
    description: z.string().min(2).max(1000),
    hidden: z.boolean(),
    stockQuantity: z.number().min(0).max(1000).nonnegative(),
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
    return key
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._schema.pick({ [key]: true } as any).safeParse({
          [key]: this.value[key],
        })
      : this._schema.safeParse(this.value);
  }
}

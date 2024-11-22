import { FindManyOrderResult } from '@backend/persistence/result';
import { CursorBasedPaginationResponse } from '@libs/rest';

export class FindManyOrderResponse implements CursorBasedPaginationResponse<FindManyOrderResult> {
  items!: FindManyOrderResult[];
  cursor!: number | null;

  constructor(partial: Partial<FindManyOrderResponse>) {
    Object.assign(this, partial);
  }

  static from(entities: FindManyOrderResult[], limit: number): FindManyOrderResponse {
    return new FindManyOrderResponse({
      items: entities.map((e) => ({
        ...e,
        items: e.items.map((i) => ({
          ...i,
          product: {
            ...i.product,
            representativeImage: {
              id: i.product.representativeImage.id,
              url: `http://localhost:3000/${i.product.representativeImage.url}`,
            },
          },
        })),
      })),
      cursor: entities.length < limit ? null : entities[entities.length - 1].id,
    });
  }
}

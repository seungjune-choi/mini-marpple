import { FindManyOrderResult } from '@backend/persistence/result';
import { CursorBasedPaginationResponse } from '@libs/rest';

export class FindManyOrderResponse implements CursorBasedPaginationResponse<FindManyOrderResult> {
  items!: FindManyOrderResult[];
  cursor!: number;

  constructor(partial: Partial<FindManyOrderResponse>) {
    Object.assign(this, partial);
  }

  static from(entities: FindManyOrderResult[]): FindManyOrderResponse {
    return new FindManyOrderResponse({
      items: entities,
      cursor: entities[entities.length - 1].id,
    });
  }
}

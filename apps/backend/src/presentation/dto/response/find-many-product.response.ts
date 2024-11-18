import { FindManyProductResult } from '@backend/persistence/result';
import { CursorBasedPaginationResponse } from '@libs/rest';

export class FindManyProductResponse implements CursorBasedPaginationResponse<FindManyProductResult> {
  items!: FindManyProductResult[];
  cursor!: number;

  constructor(partial: Partial<FindManyProductResponse>) {
    Object.assign(this, partial);
  }

  static from(entities: FindManyProductResult[]): FindManyProductResponse {
    return new FindManyProductResponse({
      items: entities.map((e) => ({
        ...e,
        representativeImage: {
          ...e.representativeImage,
          url: `http://localhost:3000/uploads/${e.representativeImage.url}`,
        },
      })),
      cursor: entities[entities.length - 1].id,
    });
  }
}

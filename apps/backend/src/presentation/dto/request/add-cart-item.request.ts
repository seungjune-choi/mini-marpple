import { IsInt, Max, Min } from 'class-validator';

export class AddCartItemRequest {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  productId!: number;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  quantity!: number;
}

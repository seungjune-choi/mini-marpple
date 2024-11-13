import { IsInt, Max, Min } from 'class-validator';

export class UpdateCartItemQuantityRequest {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  quantity!: number;
}

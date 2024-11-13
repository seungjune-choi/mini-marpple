import { IsBoolean, IsInt } from 'class-validator';

export class ProductImageRequest {
  @IsInt()
  id!: number;

  @IsBoolean()
  isRepresentative!: boolean;
}

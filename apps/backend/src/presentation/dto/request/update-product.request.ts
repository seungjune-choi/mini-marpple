import { IsArray, IsBoolean, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductImage, UpdateProductArgs } from '@backend/core';
import { ProductImageRequest } from './product-image.request';

export class UpdateProductRequest {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  categoryId!: number;

  @IsString()
  @Length(1, 255)
  name!: string;

  @IsString()
  @Length(1, 1000)
  description!: string;

  @IsInt()
  @Min(1000)
  @Max(100_000_000)
  price!: number;

  @IsBoolean()
  hidden!: boolean;

  @IsInt()
  @Min(0)
  stockQuantity!: number;

  @IsArray()
  @Type(() => ProductImageRequest)
  images: ProductImageRequest[] = [];

  toCoreDto(images: ProductImage[]): UpdateProductArgs {
    return {
      categoryId: this.categoryId,
      name: this.name,
      description: this.description,
      price: this.price,
      stockQuantity: this.stockQuantity,
      hidden: this.hidden,
      images,
    };
  }
}

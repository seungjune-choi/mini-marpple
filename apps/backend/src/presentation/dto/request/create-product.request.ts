import { IsArray, IsBoolean, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Product, ProductImage } from '@backend/core';
import { ProductImageRequest } from './product-image.request';

export class CreateProductRequest {
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

  toEntity(images: ProductImage[]): Product {
    return Product.new({
      name: this.name,
      price: this.price,
      description: this.description,
      categoryId: this.categoryId,
      hidden: this.hidden,
      stockQuantity: this.stockQuantity,
      images,
    });
  }
}

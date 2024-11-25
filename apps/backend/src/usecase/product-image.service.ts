import { Injectable } from '@libs/decorators';
import { ProductImageRepository } from '@backend/persistence/product-image.repository';
import { ProductImage } from 'src/core';

@Injectable()
export class ProductImageService {
  constructor(private readonly productImageRepository: ProductImageRepository) {}

  async create(path: string): Promise<{ id: number; path: string }> {
    const image = ProductImage.new({
      path,
      isRepresentative: false,
    });

    return await this.productImageRepository.create(image);
  }

  async findMany(ids: number[]): Promise<ProductImage[]> {
    return await this.productImageRepository.findManyByIds(ids);
  }
}

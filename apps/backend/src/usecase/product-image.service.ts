import { Injectable } from '@libs/decorators';
import { ProductImageRepository } from '@backend/persistence/product-image.repository';
import { ProductImage } from 'src/core';

@Injectable()
export class ProductImageService {
  constructor(private readonly productImageRepository: ProductImageRepository) {}

  async create(filePaths: string[]): Promise<void> {
    const images = filePaths.map((path) =>
      ProductImage.new({
        path,
        isRepresentative: false,
      }),
    );

    await this.productImageRepository.createMany(images);
  }

  async findMany(ids: number[]): Promise<ProductImage[]> {
    return await this.productImageRepository.findManyByIds(ids);
  }
}

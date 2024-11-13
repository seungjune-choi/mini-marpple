import { Cacheable, Injectable } from '@libs/decorators';
import type { FindManyProductArgs } from '@backend/persistence';
import { ProductImageRepository, ProductRepository } from '@backend/persistence';
import { Product, UpdateProductArgs } from 'src/core';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageRepository: ProductImageRepository,
  ) {}

  async create(target: Product) {
    target.validate();
    return await this.productRepository.save(target);
  }

  async update(target: Product, dto: UpdateProductArgs) {
    target.update(dto);
    target.validate();
    return await this.productRepository.save(target);
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.productRepository.findOne(id);
  }

  @Cacheable()
  async findMany(args: FindManyProductArgs) {
    return await this.productRepository.findMany({
      limit: args.limit || 10,
      cursor: args.cursor,
      categoryId: args.categoryId,
    });
  }
}

import { BaseEntity } from '@backend/core/base.entity';
import { Expose } from 'class-transformer';
import { ExcludeMethod } from '@libs/types';

export class ProductImage extends BaseEntity<number> {
  @Expose({ name: 'path' })
  path!: string;

  @Expose({ name: 'product_id' })
  productId: number | null = null;

  @Expose({ name: 'is_representative' })
  isRepresentative!: boolean;

  constructor(args: Partial<ProductImage>) {
    super();
    Object.assign(this, args);
  }

  static new(args: Pick<ProductImage, 'path' | 'isRepresentative'>) {
    return new ProductImage({ ...args, productId: null });
  }

  static from(args: Partial<ExcludeMethod<ProductImage>>) {
    return new ProductImage(args);
  }

  setProductId(productId: number) {
    this.productId = productId;
    this.updatedAt = new Date();
    return this;
  }

  setRepresentative(isRepresentative: boolean) {
    this.isRepresentative = isRepresentative;
    this.updatedAt = new Date();
    return this;
  }
}

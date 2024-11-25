import { BaseEntity } from '@backend/core/base.entity';
import { Exclude, Expose } from 'class-transformer';
import { ExcludeMethod } from '@libs/types';
import { ProductImage } from '@backend/core/product-image.entity';
import { BadRequestException } from '@libs/exceptions/http';

export interface UpdateProductArgs {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  hidden: boolean;
  categoryId: number;
  images: ProductImage[];
}

export interface CreateProductArgs {
  categoryId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  hidden: boolean;
  images: ProductImage[];
}

export class Product extends BaseEntity<number> {
  @Expose({ name: 'category_id' })
  categoryId!: number;

  @Expose({ name: 'name' })
  name!: string;

  @Expose({ name: 'description' })
  description!: string;

  @Expose({ name: 'price' })
  price!: number;

  @Expose({ name: 'stock_quantity' })
  stockQuantity!: number;

  @Expose({ name: 'hidden' })
  hidden!: boolean;

  @Exclude()
  images: ProductImage[] = [];

  constructor(data: ExcludeMethod<Partial<Product>>) {
    super();
    Object.assign(this, data);
  }

  static new(args: CreateProductArgs) {
    return new Product({
      categoryId: args.categoryId,
      name: args.name,
      description: args.description,
      price: args.price,
      stockQuantity: args.stockQuantity,
      hidden: args.hidden,
      images: args.images,
    });
  }

  static from(data: ExcludeMethod<Product>) {
    return new Product(data);
  }

  getRepresentativeImage() {
    return this.images.find((image) => image.isRepresentative)!;
  }

  getOptionalImages() {
    return this.images.filter((image) => !image.isRepresentative);
  }

  decrementStock(quantity: number) {
    if (this.stockQuantity < quantity) {
      // TODO: domain error 를 보내야하지만 시간 관계상 http error
      throw new BadRequestException('Stock quantity is not enough');
    }

    this.stockQuantity -= quantity;
    return this;
  }

  incrementStock(quantity: number) {
    this.stockQuantity += quantity;

    return this;
  }

  hasStock(quantity: number) {
    return this.stockQuantity >= quantity;
  }

  update(args: UpdateProductArgs): this {
    this.images = args.images;
    this.hidden = args.hidden;
    this.price = args.price;
    this.name = args.name;
    this.description = args.description;
    this.stockQuantity = args.stockQuantity;
    this.categoryId = args.categoryId;

    return this;
  }

  validate() {
    this._validateImages();
  }

  private _validateImages() {
    console.log(this.images);
    const res = this.images.filter((image) => image.isRepresentative).length === 1;
    if (!res) {
      throw new BadRequestException('There should be only one representative image');
    }
  }
}

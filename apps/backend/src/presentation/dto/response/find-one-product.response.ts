import { Product } from 'src/core';

/**
 * {
 *   "id": number,
 *   "name": string,
 *   "description": string,
 *   "price": number,
 *   "stockQuantity": number,
 *   "hidden": boolean,
 *   "categoryId": number,
 *   "createdAt": string,
 *   "updatedAt": string,
 *   "representativeImage": {
 *      "id": number,
 *      "url": string,
 *   },
 *   "optionalImages": {
 *      "id": number,
 *      "url": string,
 *   }[],
 * }
 */
export class FindOneProductResponse {
  id!: number;
  name!: string;
  description!: string;
  price!: number;
  stockQuantity!: number;
  hidden!: boolean;
  categoryId!: number;
  createdAt!: string;
  updatedAt!: string;
  representativeImage!: {
    id: number;
    url: string;
  };
  optionalImages!: {
    id: number;
    url: string;
  }[];

  constructor(partial: Partial<FindOneProductResponse>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: Product): FindOneProductResponse {
    const representativeImage = entity.getRepresentativeImage();
    const optionalImages = entity.getOptionalImages();

    return new FindOneProductResponse({
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      stockQuantity: entity.stockQuantity,
      hidden: entity.hidden,
      categoryId: entity.categoryId!,
      createdAt: entity.createdAt!.toISOString(),
      updatedAt: entity.updatedAt!.toISOString(),
      representativeImage: {
        id: representativeImage.id!,
        url: representativeImage.path, // TODO: change to url
      },
      optionalImages: optionalImages.map((image) => ({
        id: image.id!,
        url: image.path, // TODO: change to url
      })),
    });
  }
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  hidden: boolean;
  stockQuantity: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: number;
    url: string;
    isRepresentative: boolean;
  }[];
}

export type ProductBrief = Pick<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'description' | 'hidden' | 'name' | 'price'
> & {
  representativeImage: {
    id: number;
    url: string;
  };
};

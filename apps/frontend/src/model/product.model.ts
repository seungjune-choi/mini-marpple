export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  hidden: boolean;
  stockQuantity: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    src: string;
    isRepresentative: boolean;
  }[];
}

export type ProductBrief = Pick<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'description' | 'hidden' | 'name' | 'price'
> & {
  representativeImage: {
    id: string;
    url: string;
  };
};

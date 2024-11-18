export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  hidden: boolean;
  category: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    src: string;
    isRepresentative: boolean;
  };
}

export type ProductBrief = Pick<
  Product,
  'id' | 'category' | 'createdAt' | 'updatedAt' | 'description' | 'hidden' | 'name' | 'price'
> & {
  representativeImage: {
    id: string;
    url: string;
  };
};

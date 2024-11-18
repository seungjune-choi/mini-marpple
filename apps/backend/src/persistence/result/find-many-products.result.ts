export interface FindManyProductResult {
  id: number;
  name: string;
  price: number;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  category: {
    id: number;
    name: string;
  };
  representativeImage: {
    id: number;
    url: string;
  };
}

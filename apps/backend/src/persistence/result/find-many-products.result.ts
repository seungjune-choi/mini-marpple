export interface FindManyProductResult {
  id: number;
  name: string;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
  };
  representativeImage: {
    id: number;
    url: string;
  };
}

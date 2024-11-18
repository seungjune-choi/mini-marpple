export interface FindManyProductScheme {
  id: number;
  name: string;
  price: number;
  hidden: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  categoryName: string;
  representativeImageId: number;
  representativeImagePath: string;
}

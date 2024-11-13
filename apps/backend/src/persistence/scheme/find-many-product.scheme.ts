export interface FindManyProductScheme {
  id: number;
  name: string;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  categoryName: string;
  representativeImageId: number;
  representativeImagePath: string;
}

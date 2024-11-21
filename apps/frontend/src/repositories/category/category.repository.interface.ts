export interface ICategoryRepository {
  findMany(): Promise<{ id: number; name: string }[]>;
}

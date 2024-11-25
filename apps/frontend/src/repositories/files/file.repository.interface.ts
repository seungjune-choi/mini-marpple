export interface IFileRepository {
  uploadImage(formData: FormData): Promise<{ id: number; src: string }>;
}

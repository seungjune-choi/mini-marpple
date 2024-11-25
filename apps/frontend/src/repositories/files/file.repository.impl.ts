import { baseClient } from '../../web-client';
import type { IFileRepository } from './file.repository.interface';

export class FileRepository implements IFileRepository {
  #basePath = '/files/v1';

  uploadImage(formData: FormData): Promise<{ id: number; src: string }> {
    return baseClient
      .post(`${this.#basePath}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.data);
  }
}

export const fileRepository = new FileRepository();

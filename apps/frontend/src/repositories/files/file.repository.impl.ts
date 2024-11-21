import { baseClient } from '../../web-client';
import type { IFileRepository } from './file.repository.interface';

export class FileRepository implements IFileRepository {
  #basePath = '/files/v1';

  uploadImage(formData: FormData): Promise<{ id: number }> {
    return baseClient
      .post(`${this.#basePath}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => ({ id: res.data.data.id }));
  }
}

export const fileRepository = new FileRepository();

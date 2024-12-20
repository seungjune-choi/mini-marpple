import { Controller, Post, Req } from '@libs/decorators';
import multer from 'multer';
import * as fs from 'fs';
import type { Request, Response } from 'express';
import { ProductImageService } from '@backend/usecase';
import { ResponseEntity } from '@libs/rest';
import { UploadImageResponse } from './dto/response';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dir = `./uploads`;
    // 업로드 경로가 존재하지 않으면 생성
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    callback(null, dir);
  },
  filename: (req, file, callback) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 파일당 최대 크기: 10MB
    files: 1,
  },
}).single('image'); // 'images' 필드에서 최대 10개 파일 허용

@Controller('/files/v1')
export class FileControllerV1 {
  constructor(private readonly imageService: ProductImageService) {}

  @Post('/images')
  public async uploadImage(@Req() req: Request) {
    const file = await this.#uploadFiles(req);

    return await this.imageService
      .create(file.path)
      .then((res) => ResponseEntity.created(UploadImageResponse.from(res)));
  }

  // TODO: service logic 으로 분리 고려 및 에러 처리 개선
  #uploadFiles(req: Request): Promise<Express.Multer.File> {
    return new Promise((resolve, reject) => {
      upload(req, {} as Response, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            // Multer 에러 처리
            if (err.code === 'LIMIT_FILE_SIZE') {
              reject({ error: 'Exceeds maximum file size of 1MB' });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
              reject({ error: 'Exceeds maximum file count of 10' });
            }
          }
          reject({ error: 'Unknown image upload exception' });
        }
        resolve(req.file!);
      });
    });
  }
}

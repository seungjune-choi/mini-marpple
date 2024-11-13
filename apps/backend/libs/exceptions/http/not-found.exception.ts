import { HttpStatus } from '@libs/enums';
import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.NOT_FOUND, 'Not Found', message ?? 'Not Found');
  }
}

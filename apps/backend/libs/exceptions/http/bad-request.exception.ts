import { HttpException } from '@libs/exceptions/http/http.exception';
import { HttpStatus } from '@libs/enums';

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.BAD_REQUEST, 'Bad Request', message ?? 'Bad Request');
  }
}

import { HttpStatus } from '@libs/enums';
import { HttpException } from '@libs/exceptions/http/http.exception';

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.FORBIDDEN, 'Forbidden', message ?? 'Forbidden');
  }
}
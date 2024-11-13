import { HttpException } from '@libs/exceptions/http/http.exception';
import { HttpStatus } from '@libs/enums';

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.UNAUTHORIZED, 'Unauthorized', message ?? 'Unauthorized');
  }
}

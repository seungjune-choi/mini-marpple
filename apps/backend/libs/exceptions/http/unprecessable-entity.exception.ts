import { HttpException } from '@libs/exceptions/http/http.exception';
import { HttpStatus } from '@libs/enums';

export class UnprocessableEntityException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Unprocessable Entity', message ?? 'Unprocessable Entity');
  }
}

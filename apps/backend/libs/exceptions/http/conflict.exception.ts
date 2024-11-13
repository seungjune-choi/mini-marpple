import { HttpException } from '@libs/exceptions/http/http.exception';
import { HttpStatus } from '@libs/enums';

export class ConflictException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.CONFLICT, 'Conflict', message ?? 'Conflict');
  }
}
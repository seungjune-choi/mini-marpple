import { HttpStatus } from '@libs/enums';

export class HttpException extends Error {
  constructor(
    private readonly _status: HttpStatus,
    private readonly _statusMessage: string,
    message?: string,
  ) {
    super(message);
  }

  get status() {
    return this._status;
  }

  get statusMessage() {
    return this._statusMessage;
  }
}

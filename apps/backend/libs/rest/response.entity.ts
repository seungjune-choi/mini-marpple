/* eslint-disable @typescript-eslint/no-explicit-any */
// response-entity.ts
export class ResponseEntity<T> {
  statusCode: number;
  message: string;
  data: T | null;
  error: unknown;

  constructor(statusCode: number, message: string, data: T | null = null, error: unknown = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static ok<T>(data?: T, message = 'Success'): ResponseEntity<T> {
    return new ResponseEntity(200, message, data ?? null);
  }

  static created<T>(data: T, message = 'Created'): ResponseEntity<T> {
    return new ResponseEntity(201, message, data);
  }

  static badRequest(message = 'Bad Request', error: any = null): ResponseEntity<null> {
    return new ResponseEntity(400, message, null, error);
  }

  static unauthorized(message = 'Unauthorized', error: any = null): ResponseEntity<null> {
    return new ResponseEntity(401, message, null, error);
  }

  static forbidden(message = 'Forbidden', error: any = null): ResponseEntity<null> {
    return new ResponseEntity(403, message, null, error);
  }

  static notFound(message = 'Not Found', error: any = null): ResponseEntity<null> {
    return new ResponseEntity(404, message, null, error);
  }

  static internalServerError(message = 'Internal Server Error', error: any = null): ResponseEntity<null> {
    return new ResponseEntity(500, message, null, error);
  }
}

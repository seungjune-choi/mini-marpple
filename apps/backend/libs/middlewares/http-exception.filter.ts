import { HttpException } from '@libs/exceptions/http';
import { HttpStatus } from '@libs/enums';
import * as console from 'node:console';
import { ResponseEntity } from '@libs/rest';

export const httpExceptionFilter = (err: Error | HttpException, req, res, next) => {
  if (err instanceof HttpException) {
    console.error(err);
    return res.status(err.status).json(new ResponseEntity(err.status, err.message, null, err.statusMessage));
  } else {
    console.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
};

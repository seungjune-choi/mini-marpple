import { RequestMethod } from '@libs/enums';

export interface IRequest {
  path: string;
  method: RequestMethod;
  methodName: string | symbol;
}

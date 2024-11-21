import { Request } from 'express';
import { ClassConstructor } from '@libs/types';
import { append, forEach, pipe, toArray } from '@fxts/core';

export const PARAM_METADATA = Symbol('PARAM_METADATA');

export interface RequestMetadata {
  index: number;
  type: 'body' | 'param' | 'query' | 'files' | 'req' | 'res' | 'headers' | 'user';
  propertyKey?: string;
}

export function Parameter(type: RequestMetadata['type'], propertyKey?: string): ParameterDecorator {
  return (target, propertyKeyOrSymbol, parameterIndex) => {
    const requestMetadata: RequestMetadata[] = pipe(
      Reflect.getOwnMetadata(PARAM_METADATA, target, propertyKeyOrSymbol as string) || [],
      append({ index: parameterIndex, type, propertyKey }),
      toArray,
    );

    Reflect.defineMetadata(PARAM_METADATA, requestMetadata, target, propertyKeyOrSymbol as string);
  };
}

export const Body = (propertyKey?: string) => Parameter('body', propertyKey);
export const Param = (propertyKey?: string) => Parameter('param', propertyKey);
export const Query = (propertyKey?: string) => Parameter('query', propertyKey);
export const Files = () => Parameter('files');
export const Req = () => Parameter('req');
export const Res = () => Parameter('res');
export const Headers = (propertyKey?: string) => Parameter('headers', propertyKey);
export const User = () => Parameter('user');

export function resolveMethodParameters(req: Request, target: ClassConstructor, methodName: string | symbol) {
  const args = new Array<unknown>(target[methodName].length);
  pipe(
    (Reflect.getOwnMetadata(PARAM_METADATA, target, methodName as string) || []) as RequestMetadata[],
    forEach((param) => {
      switch (param.type) {
        case 'body':
          args[param.index] = param.propertyKey ? req.body[param.propertyKey] : req.body;
          break;
        case 'param':
          args[param.index] = param.propertyKey ? req.params[param.propertyKey] : req.params;
          break;
        case 'query':
          args[param.index] = param.propertyKey ? req.query[param.propertyKey] : req.query;
          break;
        case 'headers':
          args[param.index] = param.propertyKey ? req.headers[param.propertyKey] : req.headers;
          break;
        case 'files':
          args[param.index] = req.files;
          break;
        case 'req':
          args[param.index] = req;
          break;
        case 'res':
          args[param.index] = req.res;
          break;
        case 'user':
          args[param.index] = req.user;
          break;
        default:
          throw new Error('Invalid parameter type');
      }
    }),
  );

  return args;
}

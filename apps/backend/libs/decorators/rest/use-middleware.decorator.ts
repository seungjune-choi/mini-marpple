import { RequestHandler } from 'express';

export const MIDDLEWARE_TOKEN = Symbol('__middleware__');

export function UseMiddleware(...middlewares: RequestHandler[]): MethodDecorator {
  return (target, key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(MIDDLEWARE_TOKEN, middlewares, descriptor.value);
  };
}
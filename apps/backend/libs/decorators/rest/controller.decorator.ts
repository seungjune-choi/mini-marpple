import { container, singleton } from 'tsyringe';
import { forEach, map, peek, pipe } from '@fxts/core';
import { REQUEST_METHOD_TOKEN } from '@libs/decorators/rest/request-method.decorator';
import { IRequest } from '@libs/decorators/rest/request.interface';
import { appRouter } from '@libs/appRouter';
import { MIDDLEWARE_TOKEN } from '@libs/decorators';
import { type NextFunction, Request, Response } from 'express';
import { resolveMethodParameters } from '@libs/decorators/rest/param.decorator';
import { AnonymousFunction, ClassConstructor } from '@libs/types';
import * as console from 'node:console';

export function Controller(path = ''): ClassDecorator {
  return (target: any) => {
    singleton()(target);
    const instance = container.resolve<any>(target);

    pipe(
      (Reflect.getMetadata(REQUEST_METHOD_TOKEN, target) || []) as IRequest[],
      map((req) => ({
        ...req,
        path: `${path}/${req.path}`.replace(/\/+/g, '/').replace(/\/$/, ''),
        middlewares: Reflect.getMetadata(MIDDLEWARE_TOKEN, instance[req.methodName]) || [],
      })),
      peek((req) => {
        console.log(
          `[INFO] mapping ${req.method.toUpperCase()}:${req.path} to ${target.name}.${req.methodName.toString()}`,
        );
      }),
      forEach((req) => {
        appRouter[req.method](
          req.path,
          req.middlewares,
          asyncHandler(instance[req.methodName].bind(instance), target.prototype, req.methodName),
        );
      }),
    );
  };
}

function asyncHandler(handler: AnonymousFunction, target: ClassConstructor, methodName: string | symbol) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const args = resolveMethodParameters(req, target, methodName);
      const result = await handler(...args);
      if (!res.headersSent) {
        res.json(result);
      }
    } catch (error) {
      next(error);
    }
  };
}

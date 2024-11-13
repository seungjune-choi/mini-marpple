/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import { ClassConstructor } from '@libs/types';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ResponseEntity } from '@libs/rest';

export const BodyValidator =
  (type: ClassConstructor): RequestHandler =>
  (req, res, next) => {
    if (!req.body) return res.status(400).json(ResponseEntity.badRequest('empty request body'));
    const instance = plainToInstance(type, req.body) as any;

    const errors = validateSync(instance);

    if (errors.length) {
      return res.status(400).json(
        ResponseEntity.badRequest(
          'Invalid request body',
          errors.map(({ constraints, property }) => ({
            property,
            constraints,
          })),
        ),
      );
    }
    
    req.body = instance;

    next();
  };

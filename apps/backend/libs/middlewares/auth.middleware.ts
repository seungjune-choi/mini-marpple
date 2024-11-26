import { RequestHandler } from 'express';

export const AuthGuard: RequestHandler = (req, res, next) => {
  console.log('AuthGuard', req.user);
  if (!req.isAuthenticated()) {
    return res.status(403).send('Forbidden');
  } else {
    next();
  }
};

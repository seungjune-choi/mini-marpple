import { userRepository } from '../../../repositories/users';

export const sessionMiddleware = async (req, res, next) => {
  const isSigned = !!req.headers.cookie?.includes('_sid_');
  /**
   * @deprecated
   */
  req.isSigned = isSigned;
  req.user = await userRepository.me(req.headers.cookie);
  next();
};

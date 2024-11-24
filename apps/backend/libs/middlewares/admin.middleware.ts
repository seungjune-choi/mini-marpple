import { ForbiddenException } from '@libs/exceptions/http';

export const AdminMiddleware = (req, _, next) => {
  if (!req.user?.isAdmin) {
    throw new ForbiddenException('관리자만 접근할 수 있습니다.');
  }

  next();
};

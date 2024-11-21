export const sessionMiddleware = (req, res, next) => {
  const isSigned = !!req.headers.cookie?.includes('_sid_');
  req.isSigned = isSigned;
  next();
};

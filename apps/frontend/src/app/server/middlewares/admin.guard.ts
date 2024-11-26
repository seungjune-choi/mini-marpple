export const adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) {
    res.status(403).send(`
        <script>
            alert('관리자만 접근할 수 있습니다.');
            window.history.back();
        </script>
    `);
    return;
  }
  next();
};

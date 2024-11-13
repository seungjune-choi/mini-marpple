import type { NextFunction, Request, Response } from 'express';
import UAParser from 'ua-parser-js';
import favicon from '../../../../public/favicon.ico';

export function faviconInterceptor(req: Request, res: Response, next: NextFunction) {
  const parser = new UAParser(req.headers['user-agent']);
  res.locals.is_mobile = !!parser.getDevice().type;

  res.locals.layoutData = {
    html: {
      is_mobile: res.locals.is_mobile,
    },
    head: {
      title: '',
      description: '',
      link_tags: [
        {
          rel: 'icon',
          href: favicon,
          type: 'image/x-icon',
        },
      ],
    },
  };

  return next();
}

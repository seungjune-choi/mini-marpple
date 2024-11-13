import { Logger } from '@libs/logger';
import { RequestHandler } from 'express';

const logger = new Logger('request');

export const loggerMiddleware: RequestHandler = (req, res, next) => {
  const requester = req.user ?? 'anonymous';
  const startTime = Date.now();

  // 응답이 완료된 후에 로깅하기 위해 `res.on('finish')` 이벤트 리스너 추가
  res.on('finish', () => {
    const elapsedTime = Date.now() - startTime; // 요청 처리 시간 계산
    logger.info(
      `[${req.method}] : ${JSON.stringify({
        userAgent: req.get('user-agent'),
        requester,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,       // 응답 코드
        statusMessage: res.statusMessage, // 응답 메시지
        contentLength: res.get('content-length'), // 실제 응답 content-length
        contentType: res.get('content-type'),
        ip: req.ip,
        elapsedTime: `${elapsedTime}ms`,
        timestamp: new Date().toISOString(),
      })}`
    );
  });

  next();
};

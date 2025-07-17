// server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger';

const logger = createLogger();

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // 기본 에러 응답
  let statusCode = 500;
  let message = '서버 내부 오류가 발생했습니다.';

  // 특정 에러 타입 처리
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = '입력 데이터가 올바르지 않습니다.';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = '인증이 필요합니다.';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    message = '접근 권한이 없습니다.';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = '요청한 리소스를 찾을 수 없습니다.';
  } else if (error.status) {
    statusCode = error.status;
    message = error.message || message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error.details,
    }),
  });
};
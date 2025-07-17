// server/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 임시로 검증 통과
    next();
  };
};

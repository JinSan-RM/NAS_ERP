import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';

export const permissionMiddleware = (resource: string, action: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
};
import { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => void;
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const rateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const validationMiddleware: (schema: any) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const permissionMiddleware: (resource: string, action: string) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;

import { Request, Response, NextFunction } from 'express';
export declare const validationMiddleware: (schema: any) => (req: Request, res: Response, next: NextFunction) => void;

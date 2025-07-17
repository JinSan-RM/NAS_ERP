import { Request, Response, NextFunction } from 'express';
export declare class ReceiptController {
    getReceipts(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}

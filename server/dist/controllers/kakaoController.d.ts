import { Request, Response, NextFunction } from 'express';
export declare class KakaoController {
    sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}

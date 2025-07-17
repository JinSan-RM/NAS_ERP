import { Request, Response, NextFunction } from 'express';
export declare class PurchaseController {
    getRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPendingRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRequestStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRequestById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    approveRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    duplicateRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    bulkApprove(req: Request, res: Response, next: NextFunction): Promise<void>;
    bulkReject(req: Request, res: Response, next: NextFunction): Promise<void>;
    exportRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
}

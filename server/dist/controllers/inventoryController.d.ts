import { Request, Response, NextFunction } from 'express';
export declare class InventoryController {
    getItems(req: Request, res: Response, next: NextFunction): Promise<void>;
    getItemById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    createItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateItem(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    deleteItem(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    updateItemStatus(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    getSuppliers(req: Request, res: Response, next: NextFunction): Promise<void>;
    searchItems(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    getLowStockItems(req: Request, res: Response, next: NextFunction): Promise<void>;
}

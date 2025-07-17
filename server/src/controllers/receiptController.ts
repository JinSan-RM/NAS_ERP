import { Request, Response, NextFunction } from 'express';

export class ReceiptController {
  async getReceipts(req: Request, res: Response, next: NextFunction) {
    return res.json({ success: true, data: [] });
  }
}
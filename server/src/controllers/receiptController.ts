// server/src/controllers/receiptController.ts
export class ReceiptController {
  async getReceipts(req: Request, res: Response, next: NextFunction) {
    res.json({ success: true, data: [] });
  }
}
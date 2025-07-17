import { Request, Response, NextFunction } from 'express';

export class UploadController {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    return res.json({ success: true, message: '파일이 업로드되었습니다.' });
  }
}
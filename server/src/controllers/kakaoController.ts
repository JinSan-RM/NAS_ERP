import { Request, Response, NextFunction } from 'express';

export class KakaoController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    return res.json({ success: true, message: '메시지를 전송했습니다.' });
  }
}
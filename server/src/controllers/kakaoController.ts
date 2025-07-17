// server/src/controllers/kakaoController.ts
export class KakaoController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    res.json({ success: true, message: '메시지를 전송했습니다.' });
  }
}
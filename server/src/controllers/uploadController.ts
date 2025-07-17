// server/src/controllers/uploadController.ts
export class UploadController {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    res.json({ success: true, message: '파일이 업로드되었습니다.' });
  }
}
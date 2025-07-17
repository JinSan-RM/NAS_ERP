"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
// server/src/controllers/uploadController.ts
class UploadController {
    async uploadFile(req, res, next) {
        res.json({ success: true, message: '파일이 업로드되었습니다.' });
    }
}
exports.UploadController = UploadController;
//# sourceMappingURL=uploadController.js.map
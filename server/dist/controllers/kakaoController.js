"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakaoController = void 0;
// server/src/controllers/kakaoController.ts
class KakaoController {
    async sendMessage(req, res, next) {
        res.json({ success: true, message: '메시지를 전송했습니다.' });
    }
}
exports.KakaoController = KakaoController;
//# sourceMappingURL=kakaoController.js.map
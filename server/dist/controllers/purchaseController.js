"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseController = void 0;
class PurchaseController {
    async getRequests(req, res, next) {
        res.json({ success: true, data: [] });
    }
    async getMyRequests(req, res, next) {
        res.json({ success: true, data: [] });
    }
    async getPendingRequests(req, res, next) {
        res.json({ success: true, data: [] });
    }
    async getRequestStats(req, res, next) {
        res.json({ success: true, data: {} });
    }
    async getRequestById(req, res, next) {
        res.json({ success: true, data: null });
    }
    async createRequest(req, res, next) {
        res.json({ success: true, message: '구매 요청이 생성되었습니다.' });
    }
    async updateRequest(req, res, next) {
        res.json({ success: true, message: '구매 요청이 수정되었습니다.' });
    }
    async deleteRequest(req, res, next) {
        res.json({ success: true, message: '구매 요청이 삭제되었습니다.' });
    }
    async approveRequest(req, res, next) {
        res.json({ success: true, message: '구매 요청이 승인되었습니다.' });
    }
    async duplicateRequest(req, res, next) {
        res.json({ success: true, message: '구매 요청이 복사되었습니다.' });
    }
    async bulkApprove(req, res, next) {
        res.json({ success: true, message: '일괄 승인되었습니다.' });
    }
    async bulkReject(req, res, next) {
        res.json({ success: true, message: '일괄 거절되었습니다.' });
    }
    async exportRequests(req, res, next) {
        res.json({ success: true, message: '내보내기 완료' });
    }
}
exports.PurchaseController = PurchaseController;
//# sourceMappingURL=purchaseController.js.map
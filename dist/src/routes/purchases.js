"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/purchases.ts
const express_1 = require("express");
const purchaseController_1 = require("../controllers/purchaseController");
const validation_1 = require("../middleware/validation");
const permission_1 = require("../middleware/permission");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
const purchaseController = new purchaseController_1.PurchaseController();
// 구매 요청 목록 조회
router.get('/', (0, permission_1.permissionMiddleware)('purchase_request', 'read'), purchaseController.getRequests.bind(purchaseController));
// 내 구매 요청 목록 조회
router.get('/my-requests', purchaseController.getMyRequests.bind(purchaseController));
// 승인 대기 구매 요청 목록 조회
router.get('/pending-approvals', (0, permission_1.permissionMiddleware)('purchase_request', 'approve'), purchaseController.getPendingRequests.bind(purchaseController));
// 구매 요청 통계
router.get('/stats', (0, permission_1.permissionMiddleware)('purchase_request', 'read'), purchaseController.getRequestStats.bind(purchaseController));
// 특정 구매 요청 조회
router.get('/:id', (0, permission_1.permissionMiddleware)('purchase_request', 'read'), purchaseController.getRequestById.bind(purchaseController));
// 구매 요청 생성
router.post('/', (0, permission_1.permissionMiddleware)('purchase_request', 'create'), (0, validation_1.validationMiddleware)(validators_1.createPurchaseRequestSchema), purchaseController.createRequest.bind(purchaseController));
// 구매 요청 수정
router.put('/:id', (0, permission_1.permissionMiddleware)('purchase_request', 'update'), (0, validation_1.validationMiddleware)(validators_1.updatePurchaseRequestSchema), purchaseController.updateRequest.bind(purchaseController));
// 구매 요청 삭제
router.delete('/:id', (0, permission_1.permissionMiddleware)('purchase_request', 'delete'), purchaseController.deleteRequest.bind(purchaseController));
// 구매 요청 승인/거절
router.post('/:id/approve', (0, permission_1.permissionMiddleware)('purchase_request', 'approve'), (0, validation_1.validationMiddleware)(validators_1.approvePurchaseRequestSchema), purchaseController.approveRequest.bind(purchaseController));
// 구매 요청 복사
router.post('/:id/duplicate', (0, permission_1.permissionMiddleware)('purchase_request', 'create'), purchaseController.duplicateRequest.bind(purchaseController));
// 일괄 승인
router.post('/bulk/approve', (0, permission_1.permissionMiddleware)('purchase_request', 'approve'), purchaseController.bulkApprove.bind(purchaseController));
// 일괄 거절
router.post('/bulk/reject', (0, permission_1.permissionMiddleware)('purchase_request', 'approve'), purchaseController.bulkReject.bind(purchaseController));
// 구매 요청 내보내기
router.get('/export/excel', (0, permission_1.permissionMiddleware)('purchase_request', 'export'), purchaseController.exportRequests.bind(purchaseController));
exports.default = router;

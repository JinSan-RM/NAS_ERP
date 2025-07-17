// server/src/routes/purchases.ts
import { Router } from 'express';
import { PurchaseController } from '../controllers/purchaseController';
import { validationMiddleware } from '../middleware/validation';
import { permissionMiddleware } from '../middleware/permission';
import { 
  createPurchaseRequestSchema,
  updatePurchaseRequestSchema,
  approvePurchaseRequestSchema 
} from '../utils/validators';

const router = Router();
const purchaseController = new PurchaseController();

// 구매 요청 목록 조회
router.get('/', 
  permissionMiddleware('purchase_request', 'read'),
  purchaseController.getRequests.bind(purchaseController)
);

// 내 구매 요청 목록 조회
router.get('/my-requests',
  purchaseController.getMyRequests.bind(purchaseController)
);

// 승인 대기 구매 요청 목록 조회
router.get('/pending-approvals',
  permissionMiddleware('purchase_request', 'approve'),
  purchaseController.getPendingRequests.bind(purchaseController)
);

// 구매 요청 통계
router.get('/stats',
  permissionMiddleware('purchase_request', 'read'),
  purchaseController.getRequestStats.bind(purchaseController)
);

// 특정 구매 요청 조회
router.get('/:id',
  permissionMiddleware('purchase_request', 'read'),
  purchaseController.getRequestById.bind(purchaseController)
);

// 구매 요청 생성
router.post('/',
  permissionMiddleware('purchase_request', 'create'),
  validationMiddleware(createPurchaseRequestSchema),
  purchaseController.createRequest.bind(purchaseController)
);

// 구매 요청 수정
router.put('/:id',
  permissionMiddleware('purchase_request', 'update'),
  validationMiddleware(updatePurchaseRequestSchema),
  purchaseController.updateRequest.bind(purchaseController)
);

// 구매 요청 삭제
router.delete('/:id',
  permissionMiddleware('purchase_request', 'delete'),
  purchaseController.deleteRequest.bind(purchaseController)
);

// 구매 요청 승인/거절
router.post('/:id/approve',
  permissionMiddleware('purchase_request', 'approve'),
  validationMiddleware(approvePurchaseRequestSchema),
  purchaseController.approveRequest.bind(purchaseController)
);

// 구매 요청 복사
router.post('/:id/duplicate',
  permissionMiddleware('purchase_request', 'create'),
  purchaseController.duplicateRequest.bind(purchaseController)
);

// 일괄 승인
router.post('/bulk/approve',
  permissionMiddleware('purchase_request', 'approve'),
  purchaseController.bulkApprove.bind(purchaseController)
);

// 일괄 거절
router.post('/bulk/reject',
  permissionMiddleware('purchase_request', 'approve'),
  purchaseController.bulkReject.bind(purchaseController)
);

// 구매 요청 내보내기
router.get('/export/excel',
  permissionMiddleware('purchase_request', 'export'),
  purchaseController.exportRequests.bind(purchaseController)
);

export default router;
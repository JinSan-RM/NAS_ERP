// server/src/routes/inventory.ts
import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';

const router = Router();
const inventoryController = new InventoryController();

// 품목 목록 조회
router.get('/', inventoryController.getItems.bind(inventoryController));

// 공급업체 목록 조회
router.get('/suppliers', inventoryController.getSuppliers.bind(inventoryController));

// 검색 자동완성
router.get('/search', inventoryController.searchItems.bind(inventoryController));

// 재고 부족 품목 조회
router.get('/low-stock', inventoryController.getLowStockItems.bind(inventoryController));

// 특정 품목 조회
router.get('/:no', inventoryController.getItemById.bind(inventoryController));

// 품목 생성
router.post('/', inventoryController.createItem.bind(inventoryController));

// 품목 수정
router.put('/:no', inventoryController.updateItem.bind(inventoryController));

// 품목 삭제
router.delete('/:no', inventoryController.deleteItem.bind(inventoryController));

// 품목 상태 업데이트
router.patch('/:no/status', inventoryController.updateItemStatus.bind(inventoryController));

export default router;
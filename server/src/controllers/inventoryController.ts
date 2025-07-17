// server/src/controllers/inventoryController.ts
import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService';
import { createLogger } from '../utils/logger';
import { 
  InventoryItem, 
  CreateInventoryRequest, 
  UpdateInventoryRequest,
  PaginatedResponse,
  SearchFilters,
  SortOptions 
} from '../types';

const logger = createLogger();
const inventoryService = new InventoryService();

export class InventoryController {
  // 품목 목록 조회
  async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const filters: SearchFilters = {
        search: req.query.search as string,
        status: req.query.status as string,
        supplier: req.query.supplier as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
      };

      const sort: SortOptions = {
        field: req.query.sortField as string || 'no',
        direction: req.query.sortDirection as 'asc' | 'desc' || 'desc'
      };

      const result = await inventoryService.getItems(page, limit, filters, sort);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('품목 조회 오류:', error);
      next(error);
    }
  }

  // 특정 품목 조회
  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const itemNo = parseInt(req.params.no);
      
      if (isNaN(itemNo)) {
        return res.status(400).json({
          success: false,
          error: '잘못된 품목 번호입니다.'
        });
      }

      const item = await inventoryService.getItemById(itemNo);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          error: '품목을 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      logger.error('품목 상세 조회 오류:', error);
      next(error);
    }
  }

  // 품목 생성
  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const itemData: CreateInventoryRequest = {
        ...req.body,
        specifications: req.body.specifications || '',  // 빈 문자열을 기본값으로 설정
        totalPrice: req.body.quantity * req.body.unitPrice,
        received: false,
        status: 'pending'
      };
      
      const newItem = await inventoryService.createItem(itemData);
      
      logger.info(`새 품목 생성: ${newItem.itemName} (No: ${newItem.no})`);
      
      res.status(201).json({
        success: true,
        message: '품목이 성공적으로 생성되었습니다.',
        data: newItem
      });
    } catch (error) {
      logger.error('품목 생성 오류:', error);
      next(error);
    }
  }

  // 품목 수정
  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const itemNo = parseInt(req.params.no);
      const updateData: UpdateInventoryRequest = req.body;
      
      if (isNaN(itemNo)) {
        return res.status(400).json({
          success: false,
          error: '잘못된 품목 번호입니다.'
        });
      }

      const updatedItem = await inventoryService.updateItem(itemNo, updateData);
      
      if (!updatedItem) {
        return res.status(404).json({
          success: false,
          error: '품목을 찾을 수 없습니다.'
        });
      }

      logger.info(`품목 수정: ${updatedItem.itemName} (No: ${itemNo})`);
      
      res.json({
        success: true,
        message: '품목이 성공적으로 수정되었습니다.',
        data: updatedItem
      });
    } catch (error) {
      logger.error('품목 수정 오류:', error);
      next(error);
    }
  }

  // 품목 삭제
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const itemNo = parseInt(req.params.no);
      
      if (isNaN(itemNo)) {
        return res.status(400).json({
          success: false,
          error: '잘못된 품목 번호입니다.'
        });
      }

      const deleted = await inventoryService.deleteItem(itemNo);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: '품목을 찾을 수 없습니다.'
        });
      }

      logger.info(`품목 삭제: No ${itemNo}`);
      
      res.json({
        success: true,
        message: '품목이 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      logger.error('품목 삭제 오류:', error);
      next(error);
    }
  }

  // 품목 상태 업데이트 (수령 처리)
  async updateItemStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const itemNo = parseInt(req.params.no);
      const { status, receivedDate } = req.body;
      
      if (isNaN(itemNo)) {
        return res.status(400).json({
          success: false,
          error: '잘못된 품목 번호입니다.'
        });
      }

      const updatedItem = await inventoryService.updateItemStatus(itemNo, status, receivedDate);
      
      if (!updatedItem) {
        return res.status(404).json({
          success: false,
          error: '품목을 찾을 수 없습니다.'
        });
      }

      logger.info(`품목 상태 변경: No ${itemNo} → ${status}`);
      
      res.json({
        success: true,
        message: '품목 상태가 성공적으로 변경되었습니다.',
        data: updatedItem
      });
    } catch (error) {
      logger.error('품목 상태 변경 오류:', error);
      next(error);
    }
  }

  // 공급업체 목록 조회
  async getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await inventoryService.getSuppliers();
      
      res.json({
        success: true,
        data: suppliers
      });
    } catch (error) {
      logger.error('공급업체 목록 조회 오류:', error);
      next(error);
    }
  }

  // 품목 검색 자동완성
  async searchItems(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!query || query.length < 2) {
        return res.json({
          success: true,
          data: []
        });
      }

      const results = await inventoryService.searchItems(query, limit);
      
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      logger.error('품목 검색 오류:', error);
      next(error);
    }
  }

  // 재고 부족 품목 조회
  async getLowStockItems(req: Request, res: Response, next: NextFunction) {
    try {
      const threshold = parseInt(req.query.threshold as string) || 5;
      const items = await inventoryService.getLowStockItems(threshold);
      
      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      logger.error('재고 부족 품목 조회 오류:', error);
      next(error);
    }
  }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const inventoryService_1 = require("../services/inventoryService");
const logger_1 = require("../utils/logger");
const logger = (0, logger_1.createLogger)();
const inventoryService = new inventoryService_1.InventoryService();
class InventoryController {
    // 품목 목록 조회
    async getItems(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const filters = {
                search: req.query.search,
                status: req.query.status,
                supplier: req.query.supplier,
                dateFrom: req.query.dateFrom,
                dateTo: req.query.dateTo,
            };
            const sort = {
                field: req.query.sortField || 'no',
                direction: req.query.sortDirection || 'desc'
            };
            const result = await inventoryService.getItems(page, limit, filters, sort);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            logger.error('품목 조회 오류:', error);
            next(error);
        }
    }
    // 특정 품목 조회
    async getItemById(req, res, next) {
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
        }
        catch (error) {
            logger.error('품목 상세 조회 오류:', error);
            next(error);
        }
    }
    // 품목 생성
    async createItem(req, res, next) {
        try {
            const itemData = req.body;
            const newItem = await inventoryService.createItem(itemData);
            logger.info(`새 품목 생성: ${newItem.itemName} (No: ${newItem.no})`);
            res.status(201).json({
                success: true,
                message: '품목이 성공적으로 생성되었습니다.',
                data: newItem
            });
        }
        catch (error) {
            logger.error('품목 생성 오류:', error);
            next(error);
        }
    }
    // 품목 수정
    async updateItem(req, res, next) {
        try {
            const itemNo = parseInt(req.params.no);
            const updateData = req.body;
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
        }
        catch (error) {
            logger.error('품목 수정 오류:', error);
            next(error);
        }
    }
    // 품목 삭제
    async deleteItem(req, res, next) {
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
        }
        catch (error) {
            logger.error('품목 삭제 오류:', error);
            next(error);
        }
    }
    // 품목 상태 업데이트 (수령 처리)
    async updateItemStatus(req, res, next) {
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
        }
        catch (error) {
            logger.error('품목 상태 변경 오류:', error);
            next(error);
        }
    }
    // 공급업체 목록 조회
    async getSuppliers(req, res, next) {
        try {
            const suppliers = await inventoryService.getSuppliers();
            res.json({
                success: true,
                data: suppliers
            });
        }
        catch (error) {
            logger.error('공급업체 목록 조회 오류:', error);
            next(error);
        }
    }
    // 품목 검색 자동완성
    async searchItems(req, res, next) {
        try {
            const query = req.query.q;
            const limit = parseInt(req.query.limit) || 10;
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
        }
        catch (error) {
            logger.error('품목 검색 오류:', error);
            next(error);
        }
    }
    // 재고 부족 품목 조회
    async getLowStockItems(req, res, next) {
        try {
            const threshold = parseInt(req.query.threshold) || 5;
            const items = await inventoryService.getLowStockItems(threshold);
            res.json({
                success: true,
                data: items
            });
        }
        catch (error) {
            logger.error('재고 부족 품목 조회 오류:', error);
            next(error);
        }
    }
}
exports.InventoryController = InventoryController;

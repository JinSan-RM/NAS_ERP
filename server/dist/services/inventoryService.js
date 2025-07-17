"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
// server/src/services/inventoryService.ts
const dataService_1 = require("./dataService");
class InventoryService {
    constructor() {
        this.dataService = dataService_1.DataService.getInstance();
    }
    async getItems(page, limit, filters, sort) {
        const result = this.dataService.searchInventoryItems(filters, page, limit);
        return {
            items: result.data,
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit),
            hasNext: page * limit < result.total,
            hasPrev: page > 1
        };
    }
    async getItemById(no) {
        return this.dataService.getInventoryItemById(no) || null;
    }
    async createItem(itemData) {
        return this.dataService.createInventoryItem(itemData);
    }
    async updateItem(no, updateData) {
        return this.dataService.updateInventoryItem(no, updateData);
    }
    async deleteItem(no) {
        return this.dataService.deleteInventoryItem(no);
    }
    async updateItemStatus(no, status, receivedDate) {
        const updateData = {
            status: status,
            received: status === 'received',
        };
        if (receivedDate) {
            updateData.receivedDate = receivedDate;
        }
        return this.dataService.updateInventoryItem(no, updateData);
    }
    async getSuppliers() {
        const items = this.dataService.getAllInventoryItems();
        const suppliers = [...new Set(items.map((item) => item.supplier))];
        return suppliers.filter((supplier) => supplier && typeof supplier === 'string' && supplier.trim());
    }
    async searchItems(query, limit) {
        const items = this.dataService.getAllInventoryItems();
        const searchQuery = query.toLowerCase();
        return items
            .filter((item) => item.itemName.toLowerCase().includes(searchQuery) ||
            item.specifications.toLowerCase().includes(searchQuery) ||
            item.supplier.toLowerCase().includes(searchQuery))
            .slice(0, limit);
    }
    async getLowStockItems(threshold) {
        const items = this.dataService.getAllInventoryItems();
        return items.filter((item) => item.quantity <= threshold && !item.received);
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventoryService.js.map
// server/src/services/inventoryService.ts
import { DataService } from './dataService';
import { InventoryItem, SearchFilters, SortOptions, PaginatedResponse } from '../types';

export class InventoryService {
  private dataService = DataService.getInstance();

  async getItems(page: number, limit: number, filters: SearchFilters, sort: SortOptions): Promise<PaginatedResponse<InventoryItem>> {
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

  async getItemById(no: number): Promise<InventoryItem | null> {
    return this.dataService.getInventoryItemById(no) || null;
  }

  async createItem(itemData: Omit<InventoryItem, 'no' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    return this.dataService.createInventoryItem(itemData);
  }

  async updateItem(no: number, updateData: Partial<InventoryItem>): Promise<InventoryItem | null> {
    return this.dataService.updateInventoryItem(no, updateData);
  }

  async deleteItem(no: number): Promise<boolean> {
    return this.dataService.deleteInventoryItem(no);
  }

  async updateItemStatus(no: number, status: string, receivedDate?: string): Promise<InventoryItem | null> {
    const updateData: Partial<InventoryItem> = {
      status: status as any,
      received: status === 'received',
    };

    if (receivedDate) {
      updateData.receivedDate = receivedDate;
    }

    return this.dataService.updateInventoryItem(no, updateData);
  }

  async getSuppliers(): Promise<string[]> {
    const items = this.dataService.getAllInventoryItems();
    const suppliers = [...new Set(items.map((item: any) => item.supplier))];
    return suppliers.filter((supplier: any) => supplier && typeof supplier === 'string' && supplier.trim());
  }

  async searchItems(query: string, limit: number): Promise<InventoryItem[]> {
    const items = this.dataService.getAllInventoryItems();
    const searchQuery = query.toLowerCase();
    
    return items
      .filter((item: any) => 
        item.itemName.toLowerCase().includes(searchQuery) ||
        item.specifications.toLowerCase().includes(searchQuery) ||
        item.supplier.toLowerCase().includes(searchQuery)
      )
      .slice(0, limit);
  }

  async getLowStockItems(threshold: number): Promise<InventoryItem[]> {
    const items = this.dataService.getAllInventoryItems();
    return items.filter((item: any) => item.quantity <= threshold && !item.received);
  }
}
import { InventoryItem, SearchFilters, SortOptions, PaginatedResponse } from '../types';
export declare class InventoryService {
    private dataService;
    getItems(page: number, limit: number, filters: SearchFilters, sort: SortOptions): Promise<PaginatedResponse<InventoryItem>>;
    getItemById(no: number): Promise<InventoryItem | null>;
    createItem(itemData: Omit<InventoryItem, 'no' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem>;
    updateItem(no: number, updateData: Partial<InventoryItem>): Promise<InventoryItem | null>;
    deleteItem(no: number): Promise<boolean>;
    updateItemStatus(no: number, status: string, receivedDate?: string): Promise<InventoryItem | null>;
    getSuppliers(): Promise<string[]>;
    searchItems(query: string, limit: number): Promise<InventoryItem[]>;
    getLowStockItems(threshold: number): Promise<InventoryItem[]>;
}

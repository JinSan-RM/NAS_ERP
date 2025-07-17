import { SearchFilters } from '../types';
export declare class DataService {
    private static instance;
    private dataDir;
    private inventoryData;
    private purchaseRequests;
    private receipts;
    private suppliers;
    private budgets;
    private users;
    private systemLogs;
    private constructor();
    static getInstance(): DataService;
    initialize(): Promise<void>;
    private ensureDataDirectory;
    private initializeData;
    private loadData;
    private saveData;
    getInventoryItems(): any[];
    getAllInventoryItems(): any[];
    getInventoryItemById(no: number): any | null;
    searchInventoryItems(filters: SearchFilters, page: number, limit: number): {
        data: any[];
        total: number;
    };
    createInventoryItem(item: any): any;
    updateInventoryItem(no: number, updates: any): any;
    deleteInventoryItem(no: number): boolean;
    getPurchaseRequests(): any[];
    createPurchaseRequest(request: any): any;
    getReceipts(): any[];
    createReceipt(receipt: any): any;
    getSuppliers(): any[];
    getBudgets(): any[];
    getUsers(): any[];
    getSystemLogs(): any[];
    addSystemLog(log: any): void;
}

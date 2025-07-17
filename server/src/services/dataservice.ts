// server/src/services/dataService.ts
import * as fs from 'fs';
import * as path from 'path';
import { SearchFilters } from '../types';

export class DataService {
  private static instance: DataService;
  private dataDir: string;
  private inventoryData: any[] = [];
  private purchaseRequests: any[] = [];
  private receipts: any[] = [];
  private suppliers: any[] = [];
  private budgets: any[] = [];
  private users: any[] = [];
  private systemLogs: any[] = [];

  private constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.ensureDataDirectory();
    this.initializeData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // initialize 메서드 추가
  public async initialize(): Promise<void> {
    await this.initializeData();
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private async initializeData(): Promise<void> {
    await Promise.all([
      this.loadData('inventory.json', 'inventoryData'),
      this.loadData('purchase-requests.json', 'purchaseRequests'),
      this.loadData('receipts.json', 'receipts'),
      this.loadData('suppliers.json', 'suppliers'),
      this.loadData('budgets.json', 'budgets'),
      this.loadData('users.json', 'users'),
      this.loadData('system-logs.json', 'systemLogs'),
    ]);
  }

  private async loadData(filename: string, propertyName: string): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, filename);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        (this as any)[propertyName] = data;
      }
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
    }
  }

  private saveData(filename: string, data: any): void {
    try {
      const filePath = path.join(this.dataDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
    }
  }

  // 인벤토리 관련 메서드들
  public getInventoryItems(): any[] {
    return this.inventoryData;
  }

  // 누락된 메서드들 추가
  public getAllInventoryItems(): any[] {
    return this.inventoryData;
  }

  public getInventoryItemById(no: number): any | null {
    return this.inventoryData.find(item => item.no === no) || null;
  }

  public searchInventoryItems(filters: SearchFilters, page: number, limit: number): { data: any[], total: number } {
    let filteredData = [...this.inventoryData];

    // 검색 필터 적용
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.itemName.toLowerCase().includes(searchLower) ||
        item.specifications.toLowerCase().includes(searchLower) ||
        item.supplier.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filteredData = filteredData.filter(item => item.status === filters.status);
    }

    if (filters.category) {
      filteredData = filteredData.filter(item => item.category === filters.category);
    }

    if (filters.supplier) {
      filteredData = filteredData.filter(item => item.supplier === filters.supplier);
    }

    // 페이지네이션
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filteredData.slice(start, end);

    return {
      data: paginatedData,
      total: filteredData.length
    };
  }

  public createInventoryItem(item: any): any {
    const newItem = {
      ...item,
      no: this.inventoryData.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inventoryData.push(newItem);
    this.saveData('inventory.json', this.inventoryData);
    return newItem;
  }

  public updateInventoryItem(no: number, updates: any): any {
    const index = this.inventoryData.findIndex(item => item.no === no);
    if (index !== -1) {
      this.inventoryData[index] = {
        ...this.inventoryData[index],
        ...updates,
        updatedAt: new Date()
      };
      this.saveData('inventory.json', this.inventoryData);
      return this.inventoryData[index];
    }
    return null;
  }

  public deleteInventoryItem(no: number): boolean {
    const index = this.inventoryData.findIndex(item => item.no === no);
    if (index !== -1) {
      this.inventoryData.splice(index, 1);
      this.saveData('inventory.json', this.inventoryData);
      return true;
    }
    return false;
  }

  // 구매 요청 관련 메서드들
  public getPurchaseRequests(): any[] {
    return this.purchaseRequests;
  }

  public createPurchaseRequest(request: any): any {
    const newRequest = {
      ...request,
      id: this.purchaseRequests.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.purchaseRequests.push(newRequest);
    this.saveData('purchase-requests.json', this.purchaseRequests);
    return newRequest;
  }

  // 영수증 관련 메서드들
  public getReceipts(): any[] {
    return this.receipts;
  }

  public createReceipt(receipt: any): any {
    const newReceipt = {
      ...receipt,
      id: this.receipts.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.receipts.push(newReceipt);
    this.saveData('receipts.json', this.receipts);
    return newReceipt;
  }

  // 공급업체 관련 메서드들
  public getSuppliers(): any[] {
    return this.suppliers;
  }

  // 예산 관련 메서드들
  public getBudgets(): any[] {
    return this.budgets;
  }

  // 사용자 관련 메서드들
  public getUsers(): any[] {
    return this.users;
  }

  // 시스템 로그 관련 메서드들
  public getSystemLogs(): any[] {
    return this.systemLogs;
  }

  public addSystemLog(log: any): void {
    const newLog = {
      ...log,
      id: this.systemLogs.length + 1,
      timestamp: new Date()
    };
    this.systemLogs.push(newLog);
    this.saveData('system-logs.json', this.systemLogs);
  }
}
// server/src/services/dataService.ts
import fs from 'fs/promises';
import path from 'path';
import { createLogger } from '../utils/logger';
import { 
  InventoryItem, 
  PurchaseRequest, 
  Receipt, 
  Supplier, 
  Budget, 
  User, 
  SystemLog 
} from '../types';

const logger = createLogger();

export class DataService {
  private static instance: DataService;
  private dataPath: string;
  
  // 메모리 저장소
  private inventoryData: InventoryItem[] = [];
  private purchaseRequests: PurchaseRequest[] = [];
  private receipts: Receipt[] = [];
  private suppliers: Supplier[] = [];
  private budgets: Budget[] = [];
  private users: User[] = [];
  private systemLogs: SystemLog[] = [];
  
  // ID 생성기
  private nextIds = {
    purchaseRequest: 1,
    receipt: 1,
    inventory: 1,
    supplier: 1,
    budget: 1,
    systemLog: 1
  };

  private constructor() {
    this.dataPath = path.join(process.cwd(), 'data');
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // 데이터 디렉토리 생성
      await this.ensureDataDirectory();
      
      // 데이터 로드
      await this.loadAllData();
      
      // 기본 데이터 생성 (없는 경우)
      await this.createDefaultData();
      
      logger.info('DataService 초기화 완료');
    } catch (error) {
      logger.error('DataService 초기화 실패:', error);
      throw error;
    }
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataPath);
    } catch {
      await fs.mkdir(this.dataPath, { recursive: true });
      logger.info('데이터 디렉토리 생성됨:', this.dataPath);
    }
  }

  private async loadAllData(): Promise<void> {
    await Promise.all([
      this.loadData('inventory.json', 'inventoryData'),
      this.loadData('purchase-requests.json', 'purchaseRequests'),
      this.loadData('receipts.json', 'receipts'),
      this.loadData('suppliers.json', 'suppliers'),
      this.loadData('budgets.json', 'budgets'),
      this.loadData('users.json', 'users'),
      this.loadData('system-logs.json', 'systemLogs'),
    ]);

    // Next ID 계산
    this.calculateNextIds();
  }

  private async loadData(filename: string, propertyName: keyof DataService): Promise<void> {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = await fs.readFile(filePath, 'utf8');
      (this as any)[propertyName] = JSON.parse(data);
      logger.info(`${filename} 로드 완료`);
    } catch (error) {
      logger.warn(`${filename} 로드 실패 (새로운 파일로 시작):`, error);
      (this as any)[propertyName] = [];
    }
  }

  private calculateNextIds(): void {
    this.nextIds.inventory = Math.max(...this.inventoryData.map(item => item.no), 0) + 1;
    this.nextIds.purchaseRequest = Math.max(...this.purchaseRequests.map(req => req.id), 0) + 1;
    this.nextIds.receipt = Math.max(...this.receipts.map(receipt => receipt.id), 0) + 1;
    this.nextIds.systemLog = Math.max(...this.systemLogs.map(log => log.id), 0) + 1;
  }

  async saveData(type: string, data: any[]): Promise<void> {
    try {
      const filename = `${type}.json`;
      const filePath = path.join(this.dataPath, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      logger.debug(`${filename} 저장 완료`);
    } catch (error) {
      logger.error(`${type} 저장 실패:`, error);
      throw error;
    }
  }

  async saveAllData(): Promise<void> {
    await Promise.all([
      this.saveData('inventory', this.inventoryData),
      this.saveData('purchase-requests', this.purchaseRequests),
      this.saveData('receipts', this.receipts),
      this.saveData('suppliers', this.suppliers),
      this.saveData('budgets', this.budgets),
      this.saveData('users', this.users),
      this.saveData('system-logs', this.systemLogs),
    ]);
  }

  private async createDefaultData(): Promise<void> {
    // 기본 사용자 생성
    if (this.users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: 'admin',
          email: 'admin@company.com',
          name: '관리자',
          employeeId: 'EMP001',
          department: 'IT',
          position: '시스템 관리자',
          role: 'admin',
          permissions: [
            { resource: '*', actions: ['*'] }
          ],
          approvalLimits: {
            office_supplies: 1000000,
            it_equipment: 5000000,
            furniture: 3000000,
            facility: 2000000,
            marketing: 1000000,
            travel: 500000,
            training: 300000,
            maintenance: 1000000,
            software: 2000000,
            service: 1000000,
            other: 500000
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      this.users = defaultUsers;
      await this.saveData('users', this.users);
    }

    // 기본 공급업체 생성
    if (this.suppliers.length === 0) {
      const defaultSuppliers: Supplier[] = [
        {
          id: 'SUP001',
          name: '(주)오피스마트',
          businessNumber: '123-45-67890',
          representative: '김사장',
          contactInfo: {
            primaryContact: '김담당',
            email: 'contact@officemart.com',
            phone: '02-1234-5678',
            website: 'www.officemart.com'
          },
          address: {
            street: '서울시 강남구 테헤란로 123',
            city: '서울',
            state: '서울',
            zipCode: '12345',
            country: '대한민국'
          },
          rating: {
            overall: 4.5,
            quality: 4.3,
            delivery: 4.7,
            price: 4.2,
            service: 4.6,
            lastUpdated: new Date().toISOString()
          },
          categories: ['office_supplies', 'furniture'],
          paymentTerms: '월말 결제',
          deliveryTerms: '주문 후 3일 이내',
          contracts: [],
          isPreferred: true,
          isActive: true,
          performance: {
            totalOrders: 50,
            completedOrders: 48,
            averageDeliveryTime: 2.5,
            defectRate: 2,
            onTimeDeliveryRate: 96
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      this.suppliers = defaultSuppliers;
      await this.saveData('suppliers', this.suppliers);
    }

    // 기본 예산 생성
    if (this.budgets.length === 0) {
      const currentYear = new Date().getFullYear();
      const defaultBudgets: Budget[] = [
        {
          id: 'BUD001',
          name: 'IT부서 연간예산',
          code: 'IT-2024',
          type: 'department',
          totalAmount: 50000000,
          usedAmount: 15000000,
          remainingAmount: 35000000,
          reservedAmount: 5000000,
          fiscalYear: currentYear,
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`,
          department: 'IT',
          ownerId: 'admin',
          approvalLimits: [
            { role: 'employee', category: 'it_equipment', maxAmount: 500000, requiresSecondApproval: false },
            { role: 'team_lead', category: 'it_equipment', maxAmount: 2000000, requiresSecondApproval: false },
            { role: 'manager', category: 'it_equipment', maxAmount: 5000000, requiresSecondApproval: true }
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      this.budgets = defaultBudgets;
      await this.saveData('budgets', this.budgets);
    }
  }

  // ==================== PURCHASE REQUESTS ====================

  getAllPurchaseRequests(): PurchaseRequest[] {
    return [...this.purchaseRequests];
  }

  getPurchaseRequestById(id: number): PurchaseRequest | undefined {
    return this.purchaseRequests.find(req => req.id === id);
  }

  async createPurchaseRequest(requestData: Omit<PurchaseRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'version'>): Promise<PurchaseRequest> {
    const id = this.nextIds.purchaseRequest++;
    const requestNumber = this.generateRequestNumber('PR');
    
    const newRequest: PurchaseRequest = {
      id,
      requestNumber,
      ...requestData,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.purchaseRequests.push(newRequest);
    await this.saveData('purchase-requests', this.purchaseRequests);
    
    await this.addSystemLog({
      action: 'create',
      entity: 'purchase_request',
      entityId: id.toString(),
      details: { requestNumber, itemName: requestData.itemName },
      userId: requestData.requesterId,
      userName: requestData.requesterName
    });

    return newRequest;
  }

  async updatePurchaseRequest(id: number, updateData: Partial<PurchaseRequest>): Promise<PurchaseRequest | null> {
    const index = this.purchaseRequests.findIndex(req => req.id === id);
    if (index === -1) return null;

    const existingRequest = this.purchaseRequests[index];
    
    // 낙관적 잠금 체크
    if (updateData.version && updateData.version !== existingRequest.version) {
      throw new Error('동시 수정이 감지되었습니다. 페이지를 새로고침 후 다시 시도해주세요.');
    }

    this.purchaseRequests[index] = {
      ...existingRequest,
      ...updateData,
      version: existingRequest.version + 1,
      updatedAt: new Date().toISOString()
    };

    await this.saveData('purchase-requests', this.purchaseRequests);
    
    await this.addSystemLog({
      action: 'update',
      entity: 'purchase_request',
      entityId: id.toString(),
      details: updateData,
      userId: updateData.requesterId || 'system',
      userName: updateData.requesterName || 'System'
    });

    return this.purchaseRequests[index];
  }

  async deletePurchaseRequest(id: number, userId: string, userName: string): Promise<boolean> {
    const index = this.purchaseRequests.findIndex(req => req.id === id);
    if (index === -1) return false;

    const deletedRequest = this.purchaseRequests.splice(index, 1)[0];
    await this.saveData('purchase-requests', this.purchaseRequests);
    
    await this.addSystemLog({
      action: 'delete',
      entity: 'purchase_request',
      entityId: id.toString(),
      details: { requestNumber: deletedRequest.requestNumber },
      userId,
      userName
    });

    return true;
  }

  // ==================== INVENTORY ====================

  getAllInventoryItems(): InventoryItem[] {
    return [...this.inventoryData];
  }

  getInventoryItemById(no: number): InventoryItem | undefined {
    return this.inventoryData.find(item => item.no === no);
  }

  async createInventoryItem(itemData: Omit<InventoryItem, 'no' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const no = this.nextIds.inventory++;
    
    const newItem: InventoryItem = {
      no,
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.inventoryData.push(newItem);
    await this.saveData('inventory', this.inventoryData);
    
    await this.addSystemLog({
      action: 'create',
      entity: 'inventory',
      entityId: no.toString(),
      details: { itemName: itemData.itemName },
      userId: itemData.requesterId || 'system',
      userName: 'System'
    });

    return newItem;
  }

  async updateInventoryItem(no: number, updateData: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const index = this.inventoryData.findIndex(item => item.no === no);
    if (index === -1) return null;

    this.inventoryData[index] = {
      ...this.inventoryData[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await this.saveData('inventory', this.inventoryData);
    
    await this.addSystemLog({
      action: 'update',
      entity: 'inventory',
      entityId: no.toString(),
      details: updateData,
      userId: updateData.requesterId || 'system',
      userName: 'System'
    });

    return this.inventoryData[index];
  }

  async deleteInventoryItem(no: number, userId: string, userName: string): Promise<boolean> {
    const index = this.inventoryData.findIndex(item => item.no === no);
    if (index === -1) return false;

    const deletedItem = this.inventoryData.splice(index, 1)[0];
    await this.saveData('inventory', this.inventoryData);
    
    await this.addSystemLog({
      action: 'delete',
      entity: 'inventory',
      entityId: no.toString(),
      details: { itemName: deletedItem.itemName },
      userId,
      userName
    });

    return true;
  }

  // ==================== RECEIPTS ====================

  getAllReceipts(): Receipt[] {
    return [...this.receipts];
  }

  getReceiptById(id: number): Receipt | undefined {
    return this.receipts.find(receipt => receipt.id === id);
  }

  async createReceipt(receiptData: Omit<Receipt, 'id' | 'receiptNumber' | 'createdAt' | 'updatedAt'>): Promise<Receipt> {
    const id = this.nextIds.receipt++;
    const receiptNumber = this.generateRequestNumber('RC');
    
    const newReceipt: Receipt = {
      id,
      receiptNumber,
      ...receiptData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.receipts.push(newReceipt);
    await this.saveData('receipts', this.receipts);
    
    // 재고 아이템 상태 업데이트
    await this.updateInventoryItem(receiptData.itemNo, {
      received: true,
      receivedDate: receiptData.receivedDate,
      status: 'received'
    });
    
    await this.addSystemLog({
      action: 'create',
      entity: 'receipt',
      entityId: id.toString(),
      details: { receiptNumber, itemName: receiptData.itemName },
      userId: receiptData.receiverId,
      userName: receiptData.receiverName
    });

    return newReceipt;
  }

  // ==================== SUPPLIERS ====================

  getAllSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  getSupplierById(id: string): Supplier | undefined {
    return this.suppliers.find(supplier => supplier.id === id);
  }

  async createSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    const id = this.generateSupplierId();
    
    const newSupplier: Supplier = {
      id,
      ...supplierData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.suppliers.push(newSupplier);
    await this.saveData('suppliers', this.suppliers);
    
    await this.addSystemLog({
      action: 'create',
      entity: 'supplier',
      entityId: id,
      details: { name: supplierData.name },
      userId: 'system',
      userName: 'System'
    });

    return newSupplier;
  }

  // ==================== BUDGETS ====================

  getAllBudgets(): Budget[] {
    return [...this.budgets];
  }

  getBudgetById(id: string): Budget | undefined {
    return this.budgets.find(budget => budget.id === id);
  }

  getBudgetByCode(code: string): Budget | undefined {
    return this.budgets.find(budget => budget.code === code);
  }

  // ==================== USERS ====================

  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  // ==================== SYSTEM LOGS ====================

  getAllSystemLogs(): SystemLog[] {
    return [...this.systemLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async addSystemLog(logData: Omit<SystemLog, 'id' | 'timestamp' | 'ipAddress' | 'level'>): Promise<SystemLog> {
    const id = this.nextIds.systemLog++;
    
    const newLog: SystemLog = {
      id,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1', // 실제 구현에서는 req.ip 사용
      level: 'info',
      ...logData
    };

    this.systemLogs.push(newLog);
    
    // 로그는 즉시 저장하지 않고 배치로 처리 (성능상 이유)
    if (this.systemLogs.length % 10 === 0) {
      await this.saveData('system-logs', this.systemLogs);
    }

    return newLog;
  }

  // ==================== UTILITY METHODS ====================

  private generateRequestNumber(prefix: string): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.nextIds.purchaseRequest).padStart(3, '0');
    return `${prefix}-${year}${month}-${sequence}`;
  }

  private generateSupplierId(): string {
    const sequence = String(this.suppliers.length + 1).padStart(3, '0');
    return `SUP${sequence}`;
  }

  // ==================== SEARCH & FILTER ====================

  searchPurchaseRequests(filters: any = {}, page = 1, limit = 20): { data: PurchaseRequest[], total: number } {
    let filtered = [...this.purchaseRequests];
    
    // 검색 필터 적용
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(req => 
        req.itemName.toLowerCase().includes(search) ||
        req.requestNumber.toLowerCase().includes(search) ||
        req.requesterName.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(req => req.status === filters.status);
    }

    if (filters.department) {
      filtered = filtered.filter(req => req.department === filters.department);
    }

    if (filters.category) {
      filtered = filtered.filter(req => req.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(req => req.requestDate >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(req => req.requestDate <= filters.dateTo);
    }

    // 정렬
    filtered.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

    // 페이지네이션
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filtered.slice(startIndex, endIndex);

    return { data, total };
  }

  searchInventoryItems(filters: any = {}, page = 1, limit = 20): { data: InventoryItem[], total: number } {
    let filtered = [...this.inventoryData];
    
    // 필터 적용 로직 (구매 요청과 유사)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.itemName.toLowerCase().includes(search) ||
        item.specifications.toLowerCase().includes(search) ||
        item.supplier.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // 정렬
    filtered.sort((a, b) => b.no - a.no);

    // 페이지네이션
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filtered.slice(startIndex, endIndex);

    return { data, total };
  }

  // ==================== DASHBOARD STATS ====================

  getDashboardStats(): any {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    const purchaseRequests = {
      total: this.purchaseRequests.length,
      pending: this.purchaseRequests.filter(req => req.status === 'pending_approval').length,
      approved: this.purchaseRequests.filter(req => req.status === 'approved').length,
      rejected: this.purchaseRequests.filter(req => req.status === 'rejected').length,
      thisMonth: this.purchaseRequests.filter(req => req.requestDate.startsWith(thisMonth)).length,
      lastMonth: this.purchaseRequests.filter(req => req.requestDate.startsWith(lastMonthStr)).length
    };

    const inventory = {
      totalItems: this.inventoryData.length,
      receivedItems: this.inventoryData.filter(item => item.received).length,
      pendingItems: this.inventoryData.filter(item => !item.received).length,
      totalValue: this.inventoryData.reduce((sum, item) => sum + item.totalPrice, 0)
    };

    const totalBudget = this.budgets.reduce((sum, budget) => sum + budget.totalAmount, 0);
    const usedBudget = this.budgets.reduce((sum, budget) => sum + budget.usedAmount, 0);

    const budget = {
      totalBudget,
      usedBudget,
      remainingBudget: totalBudget - usedBudget,
      utilizationRate: totalBudget > 0 ? (usedBudget / totalBudget) * 100 : 0
    };

    const suppliers = {
      total: this.suppliers.length,
      active: this.suppliers.filter(supplier => supplier.isActive).length,
      topPerformers: this.suppliers
        .filter(supplier => supplier.isActive)
        .sort((a, b) => b.rating.overall - a.rating.overall)
        .slice(0, 5)
    };

    return {
      purchaseRequests,
      inventory,
      budget,
      suppliers,
      recentReceipts: this.receipts
        .sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())
        .slice(0, 5)
    };
  }

  // ==================== 정리 메서드 ====================

  async cleanup(): Promise<void> {
    // 주기적으로 호출되어 오래된 로그 정리 등
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // 한 달 이상 된 debug 로그 삭제
    this.systemLogs = this.systemLogs.filter(log => 
      log.level !== 'debug' || new Date(log.timestamp) > oneMonthAgo
    );
    
    await this.saveData('system-logs', this.systemLogs);
    logger.info('데이터 정리 완료');
  }
}
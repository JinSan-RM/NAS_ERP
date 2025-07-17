"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DataService {
    constructor() {
        this.inventoryData = [];
        this.purchaseRequests = [];
        this.receipts = [];
        this.suppliers = [];
        this.budgets = [];
        this.users = [];
        this.systemLogs = [];
        this.dataDir = path.join(__dirname, '../../data');
        this.ensureDataDirectory();
        this.initializeData();
    }
    static getInstance() {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }
    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }
    async initializeData() {
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
    // 이 메서드가 클래스 내부에 있어야 합니다
    async loadData(filename, propertyName) {
        try {
            const filePath = path.join(this.dataDir, filename);
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                this[propertyName] = data;
            }
        }
        catch (error) {
            console.error(`Error loading ${filename}:`, error);
        }
    }
    saveData(filename, data) {
        try {
            const filePath = path.join(this.dataDir, filename);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        }
        catch (error) {
            console.error(`Error saving ${filename}:`, error);
        }
    }
    // 인벤토리 관련 메서드들
    getInventoryItems() {
        return this.inventoryData;
    }
    createInventoryItem(item) {
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
    updateInventoryItem(no, updates) {
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
    deleteInventoryItem(no) {
        const index = this.inventoryData.findIndex(item => item.no === no);
        if (index !== -1) {
            this.inventoryData.splice(index, 1);
            this.saveData('inventory.json', this.inventoryData);
            return true;
        }
        return false;
    }
    // 구매 요청 관련 메서드들
    getPurchaseRequests() {
        return this.purchaseRequests;
    }
    createPurchaseRequest(request) {
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
    getReceipts() {
        return this.receipts;
    }
    createReceipt(receipt) {
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
    getSuppliers() {
        return this.suppliers;
    }
    // 예산 관련 메서드들
    getBudgets() {
        return this.budgets;
    }
    // 사용자 관련 메서드들
    getUsers() {
        return this.users;
    }
    // 시스템 로그 관련 메서드들
    getSystemLogs() {
        return this.systemLogs;
    }
    addSystemLog(log) {
        const newLog = {
            ...log,
            id: this.systemLogs.length + 1,
            timestamp: new Date()
        };
        this.systemLogs.push(newLog);
        this.saveData('system-logs.json', this.systemLogs);
    }
}
exports.DataService = DataService;

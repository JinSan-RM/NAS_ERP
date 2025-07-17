"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.validateEmail = exports.sanitizeFilename = exports.generateId = exports.formatCurrency = exports.createReceiptSchema = exports.createInventoryItemSchema = exports.approvePurchaseRequestSchema = exports.updatePurchaseRequestSchema = exports.createPurchaseRequestSchema = exports.createLogger = void 0;
// server/src/utils/logger.ts
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logDir = path_1.default.join(process.cwd(), 'logs');
const createLogger = () => {
    return winston_1.default.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
        defaultMeta: { service: 'inventory-system' },
        transports: [
            // 콘솔 출력
            new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
            }),
            // 에러 로그 파일
            new winston_1.default.transports.File({
                filename: path_1.default.join(logDir, 'error.log'),
                level: 'error',
                maxsize: 5242880, // 5MB
                maxFiles: 5,
            }),
            // 전체 로그 파일
            new winston_1.default.transports.File({
                filename: path_1.default.join(logDir, 'combined.log'),
                maxsize: 5242880, // 5MB
                maxFiles: 5,
            }),
        ],
    });
};
exports.createLogger = createLogger;
// server/src/utils/validators.ts
const joi_1 = __importDefault(require("joi"));
exports.createPurchaseRequestSchema = joi_1.default.object({
    itemName: joi_1.default.string().required().min(1).max(200),
    specifications: joi_1.default.string().allow('').max(1000),
    quantity: joi_1.default.number().integer().min(1).required(),
    estimatedPrice: joi_1.default.number().min(0),
    preferredSupplier: joi_1.default.string().allow('').max(100),
    category: joi_1.default.string().valid('office_supplies', 'it_equipment', 'furniture', 'facility', 'marketing', 'travel', 'training', 'maintenance', 'software', 'service', 'other').required(),
    urgency: joi_1.default.string().valid('low', 'medium', 'high', 'emergency').required(),
    justification: joi_1.default.string().required().min(10).max(2000),
    department: joi_1.default.string().required().max(100),
    project: joi_1.default.string().allow('').max(100),
    budgetCode: joi_1.default.string().allow('').max(50),
    expectedDeliveryDate: joi_1.default.date().iso().greater('now'),
    purchaseMethod: joi_1.default.string().valid('direct', 'quotation', 'contract', 'framework', 'marketplace').required(),
});
exports.updatePurchaseRequestSchema = joi_1.default.object({
    itemName: joi_1.default.string().min(1).max(200),
    specifications: joi_1.default.string().allow('').max(1000),
    quantity: joi_1.default.number().integer().min(1),
    estimatedPrice: joi_1.default.number().min(0),
    preferredSupplier: joi_1.default.string().allow('').max(100),
    category: joi_1.default.string().valid('office_supplies', 'it_equipment', 'furniture', 'facility', 'marketing', 'travel', 'training', 'maintenance', 'software', 'service', 'other'),
    urgency: joi_1.default.string().valid('low', 'medium', 'high', 'emergency'),
    justification: joi_1.default.string().min(10).max(2000),
    department: joi_1.default.string().max(100),
    project: joi_1.default.string().allow('').max(100),
    budgetCode: joi_1.default.string().allow('').max(50),
    expectedDeliveryDate: joi_1.default.date().iso().greater('now'),
    purchaseMethod: joi_1.default.string().valid('direct', 'quotation', 'contract', 'framework', 'marketplace'),
    version: joi_1.default.number().integer().min(1),
});
exports.approvePurchaseRequestSchema = joi_1.default.object({
    action: joi_1.default.string().valid('approve', 'reject').required(),
    comments: joi_1.default.string().allow('').max(1000),
});
exports.createInventoryItemSchema = joi_1.default.object({
    itemName: joi_1.default.string().required().min(1).max(200),
    specifications: joi_1.default.string().allow('').max(1000),
    quantity: joi_1.default.number().integer().min(1).required(),
    unitPrice: joi_1.default.number().min(0).required(),
    totalPrice: joi_1.default.number().min(0).required(),
    supplier: joi_1.default.string().required().max(100),
    category: joi_1.default.string().valid('office_supplies', 'it_equipment', 'furniture', 'facility', 'marketing', 'travel', 'training', 'maintenance', 'software', 'service', 'other').required(),
    urgency: joi_1.default.string().valid('low', 'medium', 'high', 'emergency').required(),
    notes: joi_1.default.string().allow('').max(1000),
    department: joi_1.default.string().max(100),
    project: joi_1.default.string().allow('').max(100),
    budgetCode: joi_1.default.string().allow('').max(50),
    purchaseMethod: joi_1.default.string().valid('direct', 'quotation', 'contract', 'framework', 'marketplace').required(),
    requesterId: joi_1.default.string().required(),
});
exports.createReceiptSchema = joi_1.default.object({
    itemNo: joi_1.default.number().integer().min(1).required(),
    receivedQuantity: joi_1.default.number().integer().min(1).required(),
    receiverName: joi_1.default.string().required().min(1).max(100),
    receiverId: joi_1.default.string().required().max(50),
    department: joi_1.default.string().required().max(100),
    notes: joi_1.default.string().allow('').max(1000),
});
// server/src/utils/helpers.ts
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
exports.generateId = generateId;
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};
exports.sanitizeFilename = sanitizeFilename;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.delay = delay;

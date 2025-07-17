"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
// server/src/routes/index.ts
const express_1 = require("express");
const inventory_1 = __importDefault(require("./inventory"));
// import purchaseRoutes from './purchases';
// import receiptRoutes from './receipts';
// import uploadRoutes from './upload';
// import kakaoRoutes from './kakao';
const setupRoutes = (app) => {
    // 기본 API 라우트
    app.get('/api/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    });
    // 인벤토리 라우트
    app.use('/api/inventory', inventory_1.default);
    // 다른 라우트들 (나중에 활성화)
    // app.use('/api/purchases', purchaseRoutes);
    // app.use('/api/receipts', receiptRoutes);
    // app.use('/api/upload', uploadRoutes);
    // app.use('/api/kakao', kakaoRoutes);
};
exports.setupRoutes = setupRoutes;
// 기본 라우터 (하위 호환성을 위해)
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
exports.default = router;
//# sourceMappingURL=index.js.map
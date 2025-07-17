// server/src/routes/index.ts
import { Express, Router } from 'express';
import inventoryRoutes from './inventory';
// import purchaseRoutes from './purchases';
// import receiptRoutes from './receipts';
// import uploadRoutes from './upload';
// import kakaoRoutes from './kakao';

export const setupRoutes = (app: Express): void => {
  // 기본 API 라우트
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // 인벤토리 라우트
  app.use('/api/inventory', inventoryRoutes);
  
  // 다른 라우트들 (나중에 활성화)
  // app.use('/api/purchases', purchaseRoutes);
  // app.use('/api/receipts', receiptRoutes);
  // app.use('/api/upload', uploadRoutes);
  // app.use('/api/kakao', kakaoRoutes);
};

// 기본 라우터 (하위 호환성을 위해)
const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
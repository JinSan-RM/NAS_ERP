// server/src/routes/index.ts
import { Express, Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
import { validationMiddleware } from '../middleware/validation';

// Route modules
import dashboardRoutes from './dashboard';
import inventoryRoutes from './inventory';
import purchaseRoutes from './purchases';
import receiptRoutes from './receipts';
import supplierRoutes from './suppliers';
import budgetRoutes from './budgets';
import userRoutes from './users';
import uploadRoutes from './upload';
import kakaoRoutes from './kakao';
import statisticsRoutes from './statistics';
import logRoutes from './logs';
import notificationRoutes from './notifications';

export const setupRoutes = (app: Express): void => {
  // API 기본 경로
  const apiRouter = Router();

  // 공통 미들웨어 적용
  apiRouter.use(rateLimiter);
  
  // Health Check (인증 불필요)
  apiRouter.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  // 인증이 필요하지 않은 라우트들
  apiRouter.use('/auth', userRoutes); // 로그인/회원가입은 인증 불필요
  apiRouter.use('/kakao', kakaoRoutes); // 카카오톡 파싱은 인증 불필요 (선택사항)

  // 인증 미들웨어 적용
  apiRouter.use(authMiddleware);

  // 인증이 필요한 라우트들
  apiRouter.use('/dashboard', dashboardRoutes);
  apiRouter.use('/inventory', inventoryRoutes);
  apiRouter.use('/purchase-requests', purchaseRoutes);
  apiRouter.use('/receipts', receiptRoutes);
  apiRouter.use('/suppliers', supplierRoutes);
  apiRouter.use('/budgets', budgetRoutes);
  apiRouter.use('/users', userRoutes);
  apiRouter.use('/upload', uploadRoutes);
  apiRouter.use('/statistics', statisticsRoutes);
  apiRouter.use('/logs', logRoutes);
  apiRouter.use('/notifications', notificationRoutes);

  // API 라우터를 앱에 마운트
  app.use('/api', apiRouter);

  // 404 핸들러
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      path: req.path
    });
  });
};
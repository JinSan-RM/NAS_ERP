// server/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { config } from 'dotenv';
import { createLogger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { setupRoutes } from './routes';
import { DataService } from './services/dataService';

// 환경변수 로드
config();

const app = express();
const logger = createLogger();
const PORT = process.env.PORT || 3001;

// 보안 및 성능 미들웨어
app.use(helmet({
  contentSecurityPolicy: false, // 개발 환경에서는 비활성화
}));
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// 기본 미들웨어
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 정적 파일 서빙 (업로드된 파일)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 라우트 설정
setupRoutes(app);

// 프로덕션에서 React 빌드 파일 서빙
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 404 처리
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터 서비스 초기화
    await DataService.getInstance().initialize();
    
    app.listen(PORT, () => {
      logger.info(`=== 종합 ERP 관리 시스템 ===`);
      logger.info(`포트: ${PORT}`);
      logger.info(`환경: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`웹 인터페이스: http://localhost:${PORT}`);
      logger.info('==========================');
    });
  } catch (error) {
    logger.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM 신호 받음. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT 신호 받음. 서버를 종료합니다...');
  process.exit(0);
});

// 처리되지 않은 에러 처리
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

export default app;
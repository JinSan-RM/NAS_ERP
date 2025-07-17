// server/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
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
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// 기본 미들웨어
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 정적 파일 서빙 (업로드된 파일)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 라우트 설정
setupRoutes(app);

// 프로덕션에서 React 빌드 파일 서빙 (안전한 경로 체크 추가)
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/dist');
  const indexPath = path.join(clientPath, 'index.html');
  
  // 클라이언트 파일이 존재하는지 확인
  if (fs.existsSync(clientPath) && fs.existsSync(indexPath)) {
    app.use(express.static(clientPath));
    
    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
    
    logger.info(`클라이언트 파일 서빙: ${clientPath}`);
  } else {
    logger.warn(`클라이언트 파일을 찾을 수 없습니다: ${clientPath}`);
    logger.warn('API 서버만 실행됩니다.');
    
    // 클라이언트 파일이 없을 때 루트 경로 처리
    app.get('/', (req, res) => {
      res.json({
        success: true,
        message: '재고 관리 시스템 API 서버가 실행 중입니다.',
        version: '1.0.0',
        note: '클라이언트 파일이 없어 API 서버만 실행됩니다.',
        endpoints: {
          health: '/api/health',
          inventory: '/api/inventory'
        }
      });
    });
  }
} else {
  // 개발 환경에서 루트 경로 처리
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: '재고 관리 시스템 API 서버가 실행 중입니다.',
      version: '1.0.0',
      environment: 'development',
      endpoints: {
        health: '/api/health',
        inventory: '/api/inventory'
      }
    });
  });
}

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 404 처리
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      '/api/health',
      '/api/inventory',
      '/'
    ]
  });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터 서비스 초기화
    await DataService.getInstance().initialize();
    
    const server = app.listen(PORT, () => {
      logger.info(`=== 구매 관리 서비스 ===`);
      logger.info(`포트: ${PORT}`);
      logger.info(`환경: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API 서버: http://localhost:${PORT}`);
      logger.info(`Health Check: http://localhost:${PORT}/api/health`);
      logger.info('==========================');
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      logger.info('서버를 종료합니다...');
      server.close(() => {
        logger.info('서버가 정상적으로 종료되었습니다.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    logger.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

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
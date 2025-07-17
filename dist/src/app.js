"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = require("./routes");
const dataService_1 = require("./services/dataService");
// 환경변수 로드
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const logger = (0, logger_1.createLogger)();
const PORT = process.env.PORT || 3001;
// 보안 및 성능 미들웨어
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // 개발 환경에서는 비활성화
    crossOriginEmbedderPolicy: false,
}));
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// 기본 미들웨어
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// 정적 파일 서빙 (업로드된 파일)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// API 라우트 설정
(0, routes_1.setupRoutes)(app);
// 프로덕션에서 React 빌드 파일 서빙
if (process.env.NODE_ENV === 'production') {
    const clientPath = path_1.default.join(__dirname, '../../client/dist');
    app.use(express_1.default.static(clientPath));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(clientPath, 'index.html'));
    });
}
// 에러 핸들링 미들웨어
app.use(errorHandler_1.errorHandler);
// 404 처리
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    });
});
// 서버 시작
const startServer = async () => {
    try {
        // 데이터 서비스 초기화
        await dataService_1.DataService.getInstance().initialize();
        const server = app.listen(PORT, () => {
            logger.info(`=== 종합 ERP 관리 시스템 ===`);
            logger.info(`포트: ${PORT}`);
            logger.info(`환경: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`웹 인터페이스: http://localhost:${PORT}`);
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
    }
    catch (error) {
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
exports.default = app;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionMiddleware = exports.validationMiddleware = exports.rateLimiter = exports.authMiddleware = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const logger = (0, logger_1.createLogger)();
const errorHandler = (error, req, res, next) => {
    logger.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });
    // 기본 에러 응답
    let statusCode = 500;
    let message = '서버 내부 오류가 발생했습니다.';
    // 특정 에러 타입 처리
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = '입력 데이터가 올바르지 않습니다.';
    }
    else if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        message = '인증이 필요합니다.';
    }
    else if (error.name === 'ForbiddenError') {
        statusCode = 403;
        message = '접근 권한이 없습니다.';
    }
    else if (error.name === 'NotFoundError') {
        statusCode = 404;
        message = '요청한 리소스를 찾을 수 없습니다.';
    }
    else if (error.status) {
        statusCode = error.status;
        message = error.message || message;
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            details: error.details,
        }),
    });
};
exports.errorHandler = errorHandler;
// server/src/middleware/auth.ts
const authMiddleware = (req, res, next) => {
    // 개발 환경에서는 인증 우회 (선택사항)
    if (process.env.NODE_ENV === 'development') {
        req.user = {
            id: 'admin',
            name: '관리자',
            email: 'admin@company.com',
            role: 'admin',
            department: 'IT'
        };
        return next();
    }
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            success: false,
            error: '인증 토큰이 필요합니다.'
        });
    }
    try {
        // JWT 토큰 검증 로직 (실제 구현 시 추가)
        // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: '유효하지 않은 토큰입니다.'
        });
    }
};
exports.authMiddleware = authMiddleware;
// server/src/middleware/rateLimiter.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100개 요청
    message: {
        success: false,
        error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// server/src/middleware/validation.ts
const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: '입력 데이터가 올바르지 않습니다.',
                details: error.details.map((detail) => detail.message)
            });
        }
        next();
    };
};
exports.validationMiddleware = validationMiddleware;
// server/src/middleware/permission.ts
const permissionMiddleware = (resource, action) => {
    return (req, res, next) => {
        // 개발 환경에서는 권한 체크 우회
        if (process.env.NODE_ENV === 'development') {
            return next();
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '인증이 필요합니다.'
            });
        }
        // 관리자는 모든 권한
        if (user.role === 'admin') {
            return next();
        }
        // 권한 체크 로직 (실제 구현 시 추가)
        // const hasPermission = checkUserPermission(user, resource, action);
        // if (!hasPermission) {
        //   return res.status(403).json({
        //     success: false,
        //     error: '접근 권한이 없습니다.'
        //   });
        // }
        next();
    };
};
exports.permissionMiddleware = permissionMiddleware;
//# sourceMappingURL=index.js.map
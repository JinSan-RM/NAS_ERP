"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const validationMiddleware = (schema) => {
    return (req, res, next) => {
        // 임시로 검증 통과
        next();
    };
};
exports.validationMiddleware = validationMiddleware;
//# sourceMappingURL=validation.js.map
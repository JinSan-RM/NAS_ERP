"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionMiddleware = void 0;
// server/src/middleware/permission.ts
const permissionMiddleware = (resource, action) => {
    return (req, res, next) => {
        // 임시로 권한 체크 통과
        next();
    };
};
exports.permissionMiddleware = permissionMiddleware;
//# sourceMappingURL=permission.js.map
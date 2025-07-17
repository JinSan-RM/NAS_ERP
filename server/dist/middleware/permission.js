"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionMiddleware = void 0;
const permissionMiddleware = (resource, action) => {
    return (req, res, next) => {
        next();
    };
};
exports.permissionMiddleware = permissionMiddleware;
//# sourceMappingURL=permission.js.map
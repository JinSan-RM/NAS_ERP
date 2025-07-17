"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
// server/src/utils/logger.ts (간단 버전)
const createLogger = () => {
    return {
        info: (message, ...args) => {
            console.log('[INFO]', message, ...args);
        },
        error: (message, ...args) => {
            console.error('[ERROR]', message, ...args);
        },
        warn: (message, ...args) => {
            console.warn('[WARN]', message, ...args);
        },
        debug: (message, ...args) => {
            console.debug('[DEBUG]', message, ...args);
        }
    };
};
exports.createLogger = createLogger;
//# sourceMappingURL=logger.js.map
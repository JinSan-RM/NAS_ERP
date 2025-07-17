"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// 기본 라우트만 남기고 나머지는 개별 파일로 분리
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
exports.default = router;

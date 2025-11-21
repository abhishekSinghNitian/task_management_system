"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    const user = (0, auth_1.verifyAccessToken)(token);
    if (!user) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
};
exports.authenticateToken = authenticateToken;

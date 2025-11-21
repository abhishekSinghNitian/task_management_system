"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.login = exports.register = void 0;
const zod_1 = require("zod");
const client_1 = __importDefault(require("../prisma/client"));
const auth_1 = require("../utils/auth");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = registerSchema.parse(req.body);
        const existingUser = yield client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        const user = yield client_1.default.user.create({
            data: { email, password: hashedPassword },
        });
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = yield client_1.default.user.findUnique({ where: { email } });
        if (!user || !(yield (0, auth_1.comparePassword)(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = (0, auth_1.generateAccessToken)(user.id);
        const refreshToken = (0, auth_1.generateRefreshToken)(user.id);
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).json({ message: 'Refresh token required' });
    const payload = (0, auth_1.verifyRefreshToken)(refreshToken);
    if (!payload)
        return res.status(403).json({ message: 'Invalid refresh token' });
    const accessToken = (0, auth_1.generateAccessToken)(payload.userId);
    res.json({ accessToken });
});
exports.refresh = refresh;

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
exports.toggleTask = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const zod_1 = require("zod");
const client_1 = __importDefault(require("../prisma/client"));
const taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['PENDING', 'COMPLETED']).optional(),
});
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { page = '1', limit = '10', status, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const where = { userId };
    if (status)
        where.status = status;
    if (search)
        where.title = { contains: search };
    try {
        const tasks = yield client_1.default.task.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
        });
        const total = yield client_1.default.task.count({ where });
        res.json({ tasks, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const { title, description } = taskSchema.parse(req.body);
        const task = yield client_1.default.task.create({
            data: { title, description, userId: userId },
        });
        res.status(201).json(task);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError)
            return res.status(400).json({ errors: error });
        res.status(500).json({ message: 'Error creating task' });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const { title, description, status } = taskSchema.partial().parse(req.body);
        const task = yield client_1.default.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId)
            return res.status(404).json({ message: 'Task not found' });
        const updatedTask = yield client_1.default.task.update({
            where: { id },
            data: { title, description, status },
        });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const task = yield client_1.default.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId)
            return res.status(404).json({ message: 'Task not found' });
        yield client_1.default.task.delete({ where: { id } });
        res.json({ message: 'Task deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});
exports.deleteTask = deleteTask;
const toggleTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const task = yield client_1.default.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId)
            return res.status(404).json({ message: 'Task not found' });
        const updatedTask = yield client_1.default.task.update({
            where: { id },
            data: { status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING' },
        });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: 'Error toggling task' });
    }
});
exports.toggleTask = toggleTask;

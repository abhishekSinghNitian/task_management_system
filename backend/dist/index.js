"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_routes_1.default);
app.use('/tasks', task_routes_1.default);
app.get('/', (req, res) => {
    res.send('Backend is running!');
});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
exports.default = app;

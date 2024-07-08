"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello');
});
app.use('/auth', auth_routes_1.default);
app.use('/api', api_routes_1.default);
app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
exports.default = app;

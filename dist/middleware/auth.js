"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWTSECRET || 'secret', (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        const payload = decoded;
        req.body.userId = payload === null || payload === void 0 ? void 0 : payload.id;
        next();
    });
};

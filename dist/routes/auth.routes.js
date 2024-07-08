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
exports.generateToken = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../models/user.schema");
const user_db_1 = require("../db/user.db");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const saltRounds = 16;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWTSECRET || 'secret', { expiresIn: '3h' });
};
exports.generateToken = generateToken;
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        yield user_schema_1.userRegistrationSchema.parseAsync(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const resData = {
                errors: error.errors.map(err => ({ field: err.path,
                    message: err.message }))
            };
            res.status(422).json(resData);
            return;
        }
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        data.password = yield bcrypt_1.default.hash(data.password, salt);
        const user = yield (0, user_db_1.addUser)(data);
        delete user.orgs;
        const token = yield (0, exports.generateToken)({ id: data.userId });
        res.status(201).json({
            status: 'success',
            message: 'Registration',
            data: {
                accessToken: token,
                user
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'Bad Request',
            message: 'Registration unsuccessful',
            statusCode: 400
        });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_schema_1.userLoginSchema.parseAsync(req.body);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const resData = {
                errors: error.errors.map(err => ({ field: err.path,
                    message: err.message }))
            };
            res.status(422).json(resData);
            return;
        }
    }
    try {
        const user = yield (0, user_db_1.findUserByField)('email', req.body.email);
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const password = yield bcrypt_1.default.hash(req.body.password, salt);
        if (password !== user.password)
            throw new Error('authentication failed');
        const token = yield (0, exports.generateToken)({ id: user.userId });
        delete user.orgs;
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: token,
                user
            }
        });
    }
    catch (error) {
        res.status(401).json({
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 401
        });
    }
}));
exports.default = router;

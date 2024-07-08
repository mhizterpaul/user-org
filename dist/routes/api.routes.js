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
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_db_1 = require("../db/user.db");
const org_db_1 = require("../db/org.db");
const organisation_schema_1 = require("../models/organisation.schema");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
router.get('/users/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //a user gets their own record or user record in organisations they belong to or created
    let passiveUser = yield (0, user_db_1.findUserByField)('userId', req.params.id), activeUser = yield (0, user_db_1.findUserByField)('userId', req.body.userId);
    if (!passiveUser.orgs.some((element) => activeUser.orgs.includes(element))) {
        res.status(403).json({ message: "authorization error" });
        return;
    }
    delete passiveUser.orgs;
    res.status(200).json({
        status: "success",
        message: "<message>",
        data: passiveUser
    });
}));
router.get('/organisations', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_db_1.findUserByField)('userId', req.body.userId);
    const orgs = yield (0, org_db_1.getOrgs)(user.orgs);
    res.status(200).json({
        status: 'success',
        data: {
            organisations: orgs
        }
    });
}));
router.get('/organisations/:orgId', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_db_1.findUserByField)('userId', req.body.userId);
    if (!user.orgs.includes(req.params.orgId)) {
        res.status(403).json({ message: "authorization error" });
        return;
    }
    const org = yield (0, org_db_1.getOrgById)(req.params.orgId);
    res.status(200).json({
        status: 'success',
        message: '<message>',
        data: org
    });
}));
router.post('/organisations', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield organisation_schema_1.orgSchema.parseAsync(req.body);
    }
    catch (error) {
        if (!(error instanceof zod_1.ZodError)) {
            res.status(500).json({ message: "internal server error" });
            return;
        }
        const resData = {
            errors: error.errors.map(err => ({ field: err.path,
                message: err.message }))
        };
        res.status(422).json(resData);
        return;
    }
    try {
        const org = yield (0, org_db_1.addOrg)(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: org
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400
        });
    }
}));
router.post('/organisations/:orgId/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.userId ||
        typeof (req.body.userId) !== 'string' ||
        !!(yield (0, org_db_1.getOrgById)(req.params.orgId))) {
        res.status(400).json({
            message: 'Bad Request'
        });
        return;
    }
    try {
        const org = yield (0, user_db_1.addUserOrg)(req.body.userId, req.params.orgId);
        res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully'
        });
    }
    catch (err) {
        res.status(500).send({ message: "internal server error" });
    }
}));
exports.default = router;

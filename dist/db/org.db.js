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
exports.addOrg = addOrg;
exports.getOrgById = getOrgById;
exports.getOrgs = getOrgs;
const _1 = __importDefault(require("."));
function addOrg(org) {
    return __awaiter(this, void 0, void 0, function* () {
        const newOrgRes = yield _1.default.connection.query(`INSERT INTO Users (${Object.keys(org).join(', ')})
        VALUES (${Object.values(org).join(', ')}) RETURNING *`);
        return newOrgRes.rows[0];
    });
}
function getOrgById(orgId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield _1.default.connection.query(`SELECT * FROM Organisations WHERE 
        orgId = ${orgId}`);
        return res.rows[0];
    });
}
function getOrgs(orgs) {
    return __awaiter(this, void 0, void 0, function* () {
        let queryString = 'BEGIN;';
        orgs.forEach(org => {
            queryString += `SELECT * FROM Organisations
        WHERE orgId = ${org};`;
        });
        queryString += 'END;';
        const res = yield _1.default.connection.execute(queryString);
        return res.results.map(result => result.rows[0]);
    });
}

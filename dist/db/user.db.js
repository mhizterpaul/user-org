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
exports.addUserOrg = addUserOrg;
exports.addUser = addUser;
exports.findUserByField = findUserByField;
const _1 = __importDefault(require("."));
const org_db_1 = require("./org.db");
function addUserOrg(userId, orgId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield findUserByField('userId', userId);
        if (!user)
            throw new Error('invalid userId');
        user.orgs.push(orgId);
        yield _1.default.connection.query(`UPDATE Users SET orgs = ARRAY${user.orgs} WHERE userId=${userId}`);
    });
}
function addUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUserRes = yield _1.default.connection.query(`INSERT INTO Users (${Object.keys(user).join(', ')}, orgs)
        VALUES (${Object.values(user).join(', ')}, ARRAY[${user.firstName + "'s organisation"}]) RETURNING *;`);
        yield (0, org_db_1.addOrg)({
            name: user.firstName + "'s organisation",
            description: ''
        });
        return newUserRes.rows[0];
    });
}
function findUserByField(field, value) {
    return __awaiter(this, void 0, void 0, function* () {
        //return the first matching user from the database
        const res = yield _1.default.connection.query(`SELECT * FROM Users WHERE 
        ${field} = ${value}`);
        return res.rows[0];
    });
}

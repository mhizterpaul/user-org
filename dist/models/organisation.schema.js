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
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgSchema = void 0;
const zod_1 = require("zod");
const org_db_1 = require("../db/org.db");
exports.orgSchema = zod_1.z.object({
    orgId: zod_1.z.string().refine((value) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, org_db_1.getOrgById)(value); }), {
        message: 'User ID must be unique'
    }),
    name: zod_1.z.string().min(3, { message: 'First name must not be null' }),
    description: zod_1.z.string().min(3, { message: 'Last name must not be null' }),
});

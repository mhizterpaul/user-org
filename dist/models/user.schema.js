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
exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
const user_db_1 = require("../db/user.db");
exports.userRegistrationSchema = zod_1.z.object({
    userId: zod_1.z.string().refine((value) => __awaiter(void 0, void 0, void 0, function* () { return !!(yield (0, user_db_1.findUserByField)('userId', value)); }), {
        message: 'User ID must be unique'
    }),
    firstName: zod_1.z.string().min(3, { message: 'First name must not be null' }),
    lastName: zod_1.z.string().min(3, { message: 'Last name must not be null' }),
    email: zod_1.z.string().email({ message: 'Email must be in the correct format' }),
    password: zod_1.z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    phone: zod_1.z.string().regex(/^\d{10,}$/, { message: 'Phone number should include at least 10 digits' })
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Email must be in the correct format' }),
    password: zod_1.z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

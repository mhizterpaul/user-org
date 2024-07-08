"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = require("../routes/auth.routes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
//load environment variables
dotenv_1.default.config();
describe('generateToken', () => {
    it('should generate a token that expires in 3 hours and contains the correct id', () => {
        // Mock payload
        const payload = {
            id: '123456789',
            // Add other properties to the payload if needed
        };
        // Generate token
        const token = (0, auth_routes_1.generateToken)(payload);
        // Verify token expiration
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWTSECRET || 'secret');
        const expirationTime = decodedToken.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = expirationTime - currentTime;
        const threeHoursInSeconds = 3 * 60 * 60;
        expect(expiresIn).toBeCloseTo(threeHoursInSeconds, -1);
        // Verify id in the decoded token
        expect(decodedToken.id).toBe(payload.id);
    });
});

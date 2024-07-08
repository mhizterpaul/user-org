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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // replace with your actual import
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('Organization Data Access', () => {
    let user1, user2, org1Id;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        user1 = yield (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            userId: 'user1',
            firstName: 'User',
            lastName: 'One',
            email: 'someemail@gmail.com',
            password: 'password',
            phone: '1234567890'
        })
            .expect(201);
        user2 = yield (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            userId: 'user2',
            firstName: 'User',
            lastName: 'Two',
            email: 'anotheremail@yahoo.com',
            password: 'password',
            phone: '1234567890'
        })
            .expect(201);
        org1Id = yield app_1.default.get('/api/organisations')
            .set('Authorization', `Bearer ${user1.body.data.accessToken}`)
            .then((res) => res.body.data.organisation[0].orgId);
    }));
    it('should not allow a user to access data from organizations they do not have access to', () => __awaiter(void 0, void 0, void 0, function* () {
        // Each user should have a default organization, we're assuming the organization id is in the user object
        const org2Id = yield app_1.default.get('/api/organisations')
            .set('Authorization', `Bearer ${user2.body.data.accessToken}`)
            .then((res) => res.body.data.organisation[0].orgId);
        // Try to access the second organization using the token of the first user
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/organisations/${org2Id}`)
            .set('Authorization', `Bearer ${user1.body.data.accessToken}`);
        // We expect a 403 Forbidden response
        expect(res.statusCode).toEqual(403);
    }));
    it('should return 401 if the token has expired', () => __awaiter(void 0, void 0, void 0, function* () {
        // Generate an expired token
        const expiredToken = jsonwebtoken_1.default.sign({ id: user1.body.data.user.userId }, process.env.JWTSECRET || 'secret', { expiresIn: '-1h' });
        // Try to access the organization with the expired token
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/organisations/${org1Id}`)
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(res.statusCode).toEqual(401);
    }));
});

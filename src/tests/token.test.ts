import { generateToken } from '../routes/auth.routes';
import jwt from 'jsonwebtoken';

describe('generateToken', () => {
    it('should generate a token that expires in 3 hours and contains the correct id', () => {
        // Mock payload
        const payload = {
            id: '123456789',
            // Add other properties to the payload if needed
        };

        // Generate token
        const token = generateToken(payload);

        // Verify token expiration
        const decodedToken: any = jwt.verify(token, process.env.SECRET||'');
        const expirationTime = decodedToken.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = expirationTime - currentTime;
        const threeHoursInSeconds = 3 * 60 * 60;
        expect(expiresIn).toBeCloseTo(threeHoursInSeconds, -1);

        // Verify id in the decoded token
        expect(decodedToken.id).toBe(payload.id);
    });
});
import request from 'supertest';
import app from '../server';

describe('User Registration', () => {
    it('should register user successfully with default organisation', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.user.organization).toBe("John's organisation");
    });

    it('should log the user in successfully', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('accessToken');
    });

    it('should fail if required fields are missing', async () => {
        const response = await request(app)
            .post('/register')
            .send({});

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toContain('First name is required');
        expect(response.body.errors).toContain('Last name is required');
        expect(response.body.errors).toContain('Email is required');
        expect(response.body.errors).toContain('Password is required');
    });

    it('should fail if there is duplicate email or userID', async () => {
        // Register first user
        await request(app)
            .post('/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            });

        // Attempt to register second user with the same email
        const response = await request(app)
            .post('/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password456',
            });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toContain('Email already exists');
    });
});

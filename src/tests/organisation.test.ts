import request from 'supertest';
import app from '../server'; // replace with your actual import
import jwt from 'jsonwebtoken'

describe('Organization Data Access', () => {
  it('should not allow a user to access data from organizations they do not have access to', async () => {
    // Register two users
    const user1 = await request(app)
      .post('/auth/register')
      .send({
        userId: 'user1',
        firstName: 'User',
        lastName: 'One',
        email: 'someemail@gmail.com',
        password: 'password',
        phone: '1234567890'})
        .expect(201);
    const user2 = await request(app)
        .post('/auth/register')
        .send({
            userId: 'user2',
            firstName: 'User',
            lastName: 'Two',
            email: 'anotheremail@yahoo.com',
            password: 'password',
            phone: '1234567890'})
            .expect(201);

    // Each user should have a default organization, we're assuming the organization id is in the user object
    const org1Id = await app.get('/api/organisations')
    .set('Authorization', `Bearer ${user1.data.accessToken}`)
    .then((res) => res.data.organisation[0].orgId);
    const org2Id = await app.get('/api/organisations')
    .set('Authorization', `Bearer ${user2.data.accessToken}`)
    .then((res) => res.data.organisation[0].orgId);

    // Try to access the second organization using the token of the first user
    const res = await request(app)
      .get(`/api/organisations/${org2Id}`)
      .set('Authorization', `Bearer ${user1.token}`);

    // We expect a 403 Forbidden response
    expect(res.statusCode).toEqual(403);
  });
  it('should return 401 if the token has expired', async () => {
  // Generate an expired token
  const expiredToken = jwt.sign({ id: user1.id }, process.env.JWT_SECRET, { expiresIn: '-1h' });

  // Try to access the organization with the expired token
  const res = await request(app)
    .get(`/organisations/${org1Id}`)
    .set('Authorization', `Bearer ${expiredToken}`);
  expect(res.statusCode).toEqual(401);
});
});
